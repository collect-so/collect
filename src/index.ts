import axios from "axios";

const apiPrefix = "/api/v1";

const buildEndpointUrl = (
    url: string,
    path: string,
    params?: Record<string, string>
) => {
    let pathPart = path;

    if (params) {
        Object.keys(params).forEach((param) =>
            pathPart.replace(`:${param}`, params[param])
        );
    }

    return `${url}${apiPrefix}${pathPart}`;
};

const API = {
    user: {
        currentUser: "/user"
    },
    entity: {
        create: "/entity",
        get: "/entity/:id",
        update: "/entity/:id",
        delete: "/entity/:id"
    }
};

type TValue = string | number | Array<string | number>;
type TType = "string" | "number" | "datetime" | "geo";

type TNormalizedProperty = {
    privacy?: 0 | 1;
    units?: string;
    name: string;
    value: TValue;
    type?: TType;
    metadata?: string;
};

type TEntity = {
    parentId?: string;
    label?: string | Array<string>;
    privacy?: 0 | 1;
    name?: string;
    props?: Array<TNormalizedProperty>;
} & Record<string, TValue>;

// https://stackoverflow.com/questions/12756159/regex-and-iso8601-formatted-datetime
const ISO_8601 = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;
const ISO_8601_FULL = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;
const suggestType = (value: TValue): TType => {
    if (typeof value === "string" && value !== "") {
        if (ISO_8601_FULL.test(value)) {
            return "datetime";
        }
        if (!isNaN(Number(value))) {
            return "number";
        }
        return "string";
    } else if (typeof value === "number") {
        return "number";
    } else if (Array.isArray(value)) {
        return value.every((value) => suggestType(value) === "datetime")
            ? "datetime"
            : value.every((value) => suggestType(value) === "number")
                ? "number"
                : value.every((value) => suggestType(value) === "string")
                    ? "string"
                    : value.every((value) => suggestType(value) === "geo")
                        ? "geo"
                        : "string";
    } else {
        return "string";
    }
};

const normalizeData = (
    rawData:
        | Record<string, string | number | Array<string | number>>
        | Array<TNormalizedProperty>
) => {
    if (Array.isArray(rawData)) {
        return rawData.map((property) => {
            const normalizedProperty = { ...property };
            if (
                !property.hasOwnProperty("privacy") ||
                (property.privacy !== 0 &&
                    property.privacy !== 1 &&
                    property.privacy !== "0" &&
                    property.privacy !== "1")
            ) {
                normalizedProperty.privacy = 1;
            }

            if (!property.hasOwnProperty("type")) {
                normalizedProperty.type = suggestType(property.value);
            }
            return normalizedProperty;
        });
    } else {
        return Object.keys(rawData).map((name) => ({
            name,
            value: rawData[name],
            type: suggestType(rawData[name]),
            privacy: 1
        }));
    }
};

const CollectService = () => {
    const _data:  {currentUser?: {rootId: string}} = {};
    let _token: string;
    let _url: string;

    const _buildUrl = (path: string, params?: Record<string, string>) =>
        buildEndpointUrl(_url, path, params);

    const init = async ({ url, token }: { url: string; token: string }) => {
        _token = token;
        _url = url;

        const res = await axios.get(_buildUrl(API.user.currentUser), {
            headers: { Authorization: `Bearer ${token}` }
        }) as {rootId: string};

        _data.currentUser = res;

        return res
    };

    const createRecord = async (data: TEntity) => {
        const { name, privacy = 1, parentId, label, props, ...otherData } = data;
        return await axios.post(
            _buildUrl(API.entity.create),
            {
                name,
                privacy,
                parentId: parentId ?? _data?.currentUser?.rootId,
                label,
                props: normalizeData(props || otherData)
            },
            {
                headers: {Authorization: `Bearer ${_token}`}
            }
        );
    };

    const getRecord = async (id: string, options: Record<string, unknown>) => {
        return await axios.patch(_buildUrl(API.entity.get, {id}), {
            headers: {Authorization: `Bearer ${_token}`}
        });
    };

    const updateRecord = async (id: string, data: TEntity) => {
        const { name, privacy = 1, parentId, label, props, ...otherData } = data;
        return await axios.patch(
            _buildUrl(API.entity.update, {id}),
            {
                name,
                privacy,
                parentId: parentId ?? _data?.currentUser?.rootId,
                label,
                props: normalizeData(props ?? otherData)
            },
            {
                headers: {Authorization: `Bearer ${_token}`}
            }
        );
    };

    const deleteRecord = async (id: string) => {
        return await axios.delete(_buildUrl(API.entity.delete, {id}), {
            headers: {Authorization: `Bearer ${_token}`}
        });
    };

    return {
        init,
        currentUser: _data.currentUser,
        createRecord,
        updateRecord,
        deleteRecord,
        getRecord
    };
};

// const SDK = CollectService();
//
// const { data } = SDK.init({
//     url: "http://localhost",
//     token: "7e214813-8607-4937-b00a-97b8ac72d0bf"
// });
//
// const newEntity = {
//     color: "green",
//     size: "medium",
//     weight: 498,
//     material: ["leather", "cotton", "kevlar"]
// };
//
// const entity = /*await*/ SDK.createRecord(newEntity);

