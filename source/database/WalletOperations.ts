import {Sequelize} from "sequelize";

const modify_wallet = async (id: string, operation: string, amount: number, sequelize:Sequelize):  Promise<number> => {
    /* operations:
        add: adds to the users wallet
        subtract: removes from the users wallet
     */
    const wallets = sequelize.model("wallets");
    const [wallet] = await wallets.findOrCreate({
        where:{userId: id},
        defaults: {userId: id, wallet: 0}
    })
    switch (operation) {
        case "add":
            const updatedWallet = await wallet.increment('wallet', {by: amount})
            return (updatedWallet.get("wallet") as number + amount);
        case "subtract":
            if((wallet.get("wallet") as number) < amount) return 1_000_000_000;
            await wallet.decrement('wallet', {by: amount})
            return 1_111_111_111;
        case "subtractWithBal":
            if((wallet.get("wallet") as number) < amount ){
                await wallet.update({
                    wallet: 0
                })
                return 0;
            }else{
                const updated = await wallet.decrement('wallet', {by: amount})
                return (updated.get("wallet") as number) + amount;
            }
    }

    return wallet.get("wallet") as number;
}

export default modify_wallet;