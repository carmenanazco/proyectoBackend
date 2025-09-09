class CartRepository{
    constructor(dao){
        this.dao=dao
    }
    createCart = async newCart => await this.dao.create(newCart)
    getCarts = async filter => await this.dao.get(filter)
    
    getCart = async filter => await this.dao.getBy(filter)
    updateCart = async (cid, cartToUpdate) => await this.dao.update(cid, cartToUpdate)
    deleteCarts= async cid => await this.dao.delete(cid)
    deleteCart = async (cid, pid) => await this.dao.deleteBy(cid, pid)
}



export default CartRepository