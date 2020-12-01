import NonFungibleToken from 0xNFTADDRESS
import ChainmonstersRewards from 0xCHAINMONSTERS

// This transaction gets the length of an account's nft collection

pub fun main(account: Address): Int {
    let acct = getAccount(account)
    let collectionRef = acct.getCapability(/public/ChainmonstersRewardCollection)!.borrow<&{ChainmonstersRewards.ChainmonstersRewardCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}
 