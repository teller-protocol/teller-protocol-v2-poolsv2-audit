import { DeployFunction } from 'hardhat-deploy/dist/types'

const deployFn: DeployFunction = async (hre) => {
  hre.log('----------')
  hre.log('')
  hre.log('TellerV2: Proposing upgrade...')

  const tellerV2 = await hre.contracts.get('TellerV2')
  const trustedForwarder = await hre.contracts.get('MetaForwarder')
  const v2Calculations = await hre.deployments.get('V2Calculations')


 

  //const collateralManager = await hre.contracts.get('CollateralManager')
  //const marketRegistry = await hre.contracts.get('MarketRegistry')

  //const protocolPausingManager = await hre.contracts.get('ProtocolPausingManager')
 


  await hre.upgrades.proposeBatchTimelock({
    title: 'TellerV2: Gas Require',
    description: ` 
# TellerV2

* Adds gas require for repay callback. 
 
`,
    _steps: [
      {
        proxy: tellerV2,
        implFactory: await hre.ethers.getContractFactory('TellerV2', {
          libraries: {
            V2Calculations: v2Calculations.address,
          },
        }),

        opts: {
         //  unsafeSkipStorageCheck: true, // ! 
          unsafeAllow: [
            'constructor',
            'state-variable-immutable',
            'external-library-linking',
          ],
          constructorArgs: [await trustedForwarder.getAddress()],
          
       
       
        },
      }

    
    ],
  })


  //need to reinitialize ! 

  hre.log('done.')
  hre.log('')
  hre.log('----------')

  return true
}

// tags and deployment
deployFn.id = 'teller-v2:gas-require-upgrade'
deployFn.tags = [
  'proposal',
  'upgrade',
  'teller-v2',
  'teller-v2:pausing-upgrade',
]
deployFn.dependencies = ['teller-v2:deploy','protocol-pausing-manager:deploy']
deployFn.skip = async (hre) => {

    //only had to do this on polygon once 
  return !hre.network.live || !['goerli', 'polygon'].includes(hre.network.name)
}
export default deployFn
