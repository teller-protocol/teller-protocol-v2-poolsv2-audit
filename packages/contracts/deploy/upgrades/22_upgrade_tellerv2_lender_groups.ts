import { DeployFunction } from 'hardhat-deploy/dist/types'

const deployFn: DeployFunction = async (hre) => {
  hre.log('----------')
  hre.log('')
  hre.log('TellerV2 LenderGroups: Proposing upgrade...')

  const trustedForwarder = await hre.contracts.get('MetaForwarder')
  const v2Calculations = await hre.deployments.get('V2Calculations')
  const tellerV2 = await hre.contracts.get('TellerV2')
  const marketRegistry = await hre.contracts.get('MarketRegistry')
  const protocolFee = await hre.contracts.get('ProtocolFee')
  const escrowVault = await hre.contracts.get('EscrowVault')
  const collateralManager = await hre.contracts.get('CollateralManager')
  const collateralEscrowBeacon = await hre.contracts.get(
    'CollateralEscrowBeacon'
  )
  const lenderManager = await hre.contracts.get('LenderManager')
  const lenderCommitmentForwarder = await hre.contracts.get(
    'LenderCommitmentForwarder'
  )


  const protocolPausingManager = await hre.contracts.get('ProtocolPausingManager')
 


  await hre.upgrades.proposeBatchTimelock({
    title: 'TellerV2 LenderGroups Upgrade',
    description: `

# Upgrade contracts: 

# Market Registry

# TellerV2  + V2Calculations 
 
# CollateralManager
 
# CollateralEscrowV1


# Protocol Fee 


# Requires deployed new contracts: 

 
# Smart Commitment Forwarder 
# Lender Commitment Group Smart (Beacon)
# Lender Commitment Group Factory 

# Hypernative Oracle 

# Protocol Pausing Manager 



`,
    _steps: [
      {
        proxy: marketRegistry,
        implFactory: await hre.ethers.getContractFactory('MarketRegistry'),
      },

      {
        proxy: protocolFee,
        implFactory: await hre.ethers.getContractFactory('ProtocolFee'),
      },
      {
        proxy: tellerV2,
        implFactory: await hre.ethers.getContractFactory('TellerV2', {
          libraries: {
            V2Calculations: v2Calculations.address,
          },
        }),

        opts: {
          unsafeAllow: [
            'constructor',
            'state-variable-immutable',
            'external-library-linking',
          ],
          constructorArgs: [await trustedForwarder.getAddress()],

          call: {
            fn: 'setProtocolPausingManager',
            args: [await protocolPausingManager.getAddress()],
          },
        },
      },
      {
        proxy: collateralManager,
        implFactory: await hre.ethers.getContractFactory('CollateralManager'),
      },
      {
        beacon: collateralEscrowBeacon,
        implFactory: await hre.ethers.getContractFactory('CollateralEscrowV1'),
      },
     /* {
        proxy: lenderManager,
        implFactory: await hre.ethers.getContractFactory('LenderManager'),

        opts: {
          unsafeAllow: ['constructor', 'state-variable-immutable'],
          constructorArgs: [await marketRegistry.getAddress()],
        },
      },
      {
        proxy: lenderCommitmentForwarder,
        implFactory: await hre.ethers.getContractFactory(
          'LenderCommitmentForwarder'
        ),

        opts: {
          unsafeAllow: ['constructor', 'state-variable-immutable'],
          constructorArgs: [
            await tellerV2.getAddress(),
            await marketRegistry.getAddress(),
          ],
        },
      },*/
    ],
  })

  hre.log('done.')
  hre.log('')
  hre.log('----------')

  return true
}

// tags and deployment
deployFn.id = 'sherlock-audit:upgrade'
deployFn.tags = [
  'proposal',
  'upgrade',
  'sherlock-audit',
  'sherlock-audit:upgrade',
]
deployFn.dependencies = [
  'default-proxy-admin',
  'market-registry:deploy',
  'teller-v2:v2-calculations',
  'teller-v2:init',
  'escrow-vault:deploy',
]
deployFn.skip = async (hre) => {
  return (
    !hre.network.live ||
    !['mainnet', 'polygon', 'goerli'].includes(hre.network.name)
  )
}
export default deployFn
