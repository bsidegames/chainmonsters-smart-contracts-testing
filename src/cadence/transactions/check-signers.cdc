import Basic from 0x01

transaction(message: String){
    prepare(first: AuthAccount, second: AuthAccount) {
        log(first.address);
        log(second.address)
        log(Basic.message)
    }
}