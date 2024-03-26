import CollectSDK, { CollectModel } from '@collect.so/javascript-sdk'

export const Collect = new CollectSDK(
  '01da9f307ae13a24bd07c309a4b0effdywhrC2H4YL25FUDu2i511G2mbEUnrBNQ7sng/tCCEAVTLuCDMPxYrg1rA99deHsQ',
  {
    url: 'http://localhost'
  }
)

const asyncRandomNumber = async () =>
  await new Promise<number>((resolve) => {
    setTimeout(() => resolve(Math.random()), 150)
  })

const User = new CollectModel('user', {
  name: { type: 'string' },
  email: { type: 'string', uniq: true },
  id: { type: 'number', default: asyncRandomNumber },
  jobTitle: { type: 'string' },
  age: { type: 'number' },
  married: { type: 'boolean' },
  dateOfBirth: { type: 'datetime', default: () => new Date().toISOString() }
})

export const UserRepo = Collect.registerModel(User)
