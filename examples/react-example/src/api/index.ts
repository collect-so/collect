import CollectSDK, { CollectModel } from '@collect.so/javascript-sdk'

export const Collect = new CollectSDK(
  '01da9f307ae13a24bd07c309a4b0effdywhrC2H4YL25FUDu2i511G2mbEUnrBNQ7sng/tCCEAVTLuCDMPxYrg1rA99deHsQ',
  {
    url: 'http://localhost'
  }
)

const User = new CollectModel('user', {
  name: { type: 'string' },
  id: { type: 'number' },
  jobTitle: { type: 'string' },
  age: { type: 'number' },
  married: { type: 'boolean' },
  dateOfBirth: { type: 'datetime', required: false }
})

export const UserRepo = Collect.registerModel(User)
