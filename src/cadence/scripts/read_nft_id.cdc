import NonFungibleToken from 0xNFTADDRESS
import ChainmonstersRewards from 0xCHAINMONSTERS

// This script reads metadata about an NFT in a user's collection
pub fun main(account: Address): UInt64 {

    // Get the public account object of the owner of the token
    let owner = getAccount(account)

    let collectionBorrow = owner
        .getCapability(/public/ChainmonstersRewardCollection)!
        .borrow<&{ChainmonstersRewards.RewardCollectionPublic}>()!

    // Borrow a reference to a specific NFT in the collection
    let nft = collectionBorrow.borrowNFT(id: 1)

    return nft.id
}