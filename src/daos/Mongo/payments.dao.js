import { paymentModel } from "./models/payment.model.js";

class PaymentDao{
    constructor(){
        this.model = paymentModel
    }

    create = async newPayment => await this.model.create(newPayment)
    get = async(email)=> await this.model.find({ userEmail: email })
    getBy = async filterObject => await this.model.findOne(filterObject)
    update = async (paymentId, paymentUpdate) => await this.model.findByIdAndUpdate({_id: paymentId}, paymentUpdate, {new: true})
    //delete = async tid => await this.model.findByIdAndDelete({_id: tid}) 
}

export default PaymentDao