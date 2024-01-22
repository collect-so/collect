import { createApi } from "./api";
import { CollectRestAPI } from "./rest.api";

export class CollectModel extends CollectRestAPI {
    private label: string;
    private fields: any;

    constructor(modelName: string, fields: any) {
        super();
        this.label = modelName;
        this.fields = fields;
    }

    _setApi(api: ReturnType<typeof createApi>) {
        this.api = api;
    }

    getLabel() {
        return this.label
    }
}