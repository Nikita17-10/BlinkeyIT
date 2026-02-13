// import { createContext,useContext, useEffect, useState } from "react";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import { useDispatch, useSelector } from "react-redux";
// import { handleAddItemCart } from "../store/cartProduct";
// import AxiosToastError from "../utils/AxiosToastError";
// import toast from "react-hot-toast";
// import { pricewithDiscount } from "../utils/PriceWithDiscount";
// import { handleAddAddress } from "../store/addressSlice";
// import { setOrder } from "../store/orderSlice";

// export const GlobalContext = createContext(null)

// export const useGlobalContext = ()=> useContext(GlobalContext)

// const GlobalProvider = ({children}) => {
//      const dispatch = useDispatch()
//      const [totalPrice,setTotalPrice] = useState(0)
//      const [notDiscountTotalPrice,setNotDiscountTotalPrice] = useState(0)
//     const [totalQty,setTotalQty] = useState(0)
//     const cartItem = useSelector(state => state.cartItem.cart)
//     const user = useSelector(state => state?.user)

//     const fetchCartItem = async()=>{
//         try {
//           const response = await Axios({
//             ...SummaryApi.getCartItem
//           })
//           const { data : responseData } = response
    
//           if(responseData.success){
//             dispatch(handleAddItemCart(responseData.data))
//             console.log(responseData)
//           }
    
//         } catch (error) {
//           console.log(error)
//         }
//     }

//     const updateCartItem = async(id,qty)=>{
//       try {
//           const response = await Axios({
//             ...SummaryApi.updateCartItemQty,
//             data : {
//               _id : id,
//               qty : qty
//             }
//           })
//           const { data : responseData } = response

//           if(responseData.success){
//               // toast.success(responseData.message)
//               fetchCartItem()
//               return responseData
//           }
//       } catch (error) {
//         AxiosToastError(error)
//         return error
//       }
//     }
//     const deleteCartItem = async(cartId)=>{
//       try {
//           const response = await Axios({
//             ...SummaryApi.deleteCartItem,
//             data : {
//               _id : cartId
//             }
//           })
//           const { data : responseData} = response

//           if(responseData.success){
//             toast.success(responseData.message)
//             fetchCartItem()
//           }
//       } catch (error) {
//          AxiosToastError(error)
//       }
//     }

//     useEffect(()=>{
//       const qty = cartItem.reduce((preve,curr)=>{
//           return preve + curr.quantity
//       },0)
//       setTotalQty(qty)
      
//       const tPrice = cartItem.reduce((preve,curr)=>{
//           const priceAfterDiscount = pricewithDiscount(curr?.productId?.price,curr?.productId?.discount)

//           return preve + (priceAfterDiscount * curr.quantity)
//       },0)
//       setTotalPrice(tPrice)

//       const notDiscountPrice = cartItem.reduce((preve,curr)=>{
//         return preve + (curr?.productId?.price * curr.quantity)
//       },0)
//       setNotDiscountTotalPrice(notDiscountPrice)
//   },[cartItem])

//     const handleLogoutOut = ()=>{
//         localStorage.clear()
//         dispatch(handleAddItemCart([]))
//     }

//     const fetchAddress = async()=>{
//       try {
//         const response = await Axios({
//           ...SummaryApi.getAddress
//         })
//         const { data : responseData } = response

//         if(responseData.success){
//           dispatch(handleAddAddress(responseData.data))
//         }
//       } catch (error) {
//           // AxiosToastError(error)
//       }
//     }
//     const fetchOrder = async()=>{
//       try {
//         const response = await Axios({
//           ...SummaryApi.getOrderItems,
//         })
//         const { data : responseData } = response

//         if(responseData.success){
//             dispatch(setOrder(responseData.data))
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }

//     useEffect(()=>{
//       fetchCartItem()
//       handleLogoutOut()
//       fetchAddress()
//       fetchOrder()
//     },[user])
    
//     return(
//         <GlobalContext.Provider value={{
//             fetchCartItem,
//             updateCartItem,
//             deleteCartItem,
//             fetchAddress,
//             totalPrice,
//             totalQty,
//             notDiscountTotalPrice,
//             fetchOrder
//         }}>
//             {children}
//         </GlobalContext.Provider>
//     )
// }

// export default GlobalProvider


import { createContext, useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);

  const cartItem = useSelector((state) => state.cartItem.cart);
  const user = useSelector((state) => state?.user);

  /** 🛒 Fetch all cart items for logged-in user */
  const fetchCartItem = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getCartItem });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddItemCart(responseData.data));
      }
    } catch (error) {
      console.log("Fetch Cart Error:", error);
    }
  };

  /** 🔁 Update cart quantity */
  const updateCartItem = async (id, qty) => {
    try {
      const response = await Axios({
        ...SummaryApi.updateCartItemQty,
        data: { _id: id, qty },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        await fetchCartItem();
        return responseData;
      }
    } catch (error) {
      AxiosToastError(error);
      return error;
    }
  };

  /** ❌ Delete item from cart */
  const deleteCartItem = async (cartId) => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCartItem,
        data: { _id: cartId },
      });
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCartItem();
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  /** 📦 Fetch address data */
  const fetchAddress = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getAddress });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(handleAddAddress(responseData.data));
      }
    } catch (error) {
      // optional: handle silently
    }
  };

  /** 🧾 Fetch orders */
  const fetchOrder = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getOrderItems });
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setOrder(responseData.data));
      }
    } catch (error) {
      console.log("Fetch Order Error:", error);
    }
  };

  /** 🚪 Logout function */
  const handleLogoutOut = () => {
    localStorage.clear();
    dispatch(handleAddItemCart([]));
  };

  /** 📊 Calculate totals whenever cart changes */
  useEffect(() => {
    const qty = cartItem.reduce((prev, curr) => prev + curr.quantity, 0);
    setTotalQty(qty);

    const tPrice = cartItem.reduce((prev, curr) => {
      const priceAfterDiscount = pricewithDiscount(
        curr?.productId?.price,
        curr?.productId?.discount
      );
      return prev + priceAfterDiscount * curr.quantity;
    }, 0);
    setTotalPrice(tPrice);

    const notDiscountPrice = cartItem.reduce(
      (prev, curr) => prev + curr?.productId?.price * curr.quantity,
      0
    );
    setNotDiscountTotalPrice(notDiscountPrice);
  }, [cartItem]);

  /** 🧠 Fetch user-specific data on login */
  useEffect(() => {
    if (user && user?._id) {
      fetchCartItem();
      fetchAddress();
      fetchOrder();
    }
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{
        fetchCartItem,
        updateCartItem,
        deleteCartItem,
        fetchAddress,
        totalPrice,
        totalQty,
        notDiscountTotalPrice,
        fetchOrder,
        handleLogoutOut,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
