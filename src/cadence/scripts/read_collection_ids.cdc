import NonFungibleToken from 0xNFTADDRESS
import ChainmonstersRewards from 0xCHAINMONSTERS

// This transaction returns an array of all the nft ids in the collection

pub fun main(account: Address): [UInt64] {
    let acct = getAccount(account)
    let collectionRef = acct.getCapability(/public/ChainmonstersRewardCollection)!.borrow<&{ChainmonstersRewards.ChainmonstersRewardCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs()
}
 