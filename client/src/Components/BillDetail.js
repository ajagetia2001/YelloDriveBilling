import React, { useState, setState } from "react";
// import "./style.css";
import { database } from "../firebase";
import { ref, push, child, update } from "firebase/database";
import { useForm } from "react-hook-form";
import QRcode from "qrcode.react";

function BillDetails() {
  const [userName, setuserName] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [itemName, setitemName] = useState("");
  const [itemArr, setItemArr] = useState([]);
  const [itemPrice, setitemPrice] = useState([]);
  const [itemQuantity, setitemQuantity] = useState([]);
  let [totalPrice, settotalPrice] = useState(0);
  const [qr, setqr] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const registerOptions = {
    name: { required: "Name is required" },
    phoneNo: { required: "phone number is required" },
    email: { required: "Email is required" },
    password: {
      required: "Password is required",
      minLength: {
        value: 8,
        message: "Password must have at least 8 characters"
      }
    }
  };
  const handleInputChange = e => {
    const { id, value } = e.target;
    if (id === "userName") {
      setuserName(value);
    }
    if (id === "phoneNo") {
      setphoneNo(value);
    }
    if (id === "email") {
      setEmail(value);
    }
  };
  const createInvoice = async e => {
    e.preventDefault();
    const number = phoneNo;
    let obj = {
      userName: userName,
      phoneNo: phoneNo,
      email: email,
      item: itemArr,
      totalPrice: totalPrice
    };
    const res = await fetch("/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `your total bill is ${totalPrice}`,
        to: number,
        data: obj
      })
    });
    const data = await res.json();
    if (data.status === 200) {
      window.alert("success");
      console.log(data);
    }
  };
  const PostData = async e => {
    e.preventDefault();
    const number = phoneNo;
    let obj = {
      userName: userName,
      phoneNo: phoneNo,
      email: email,
      item: itemArr,
      totalPrice: totalPrice
    };
    const res = await fetch("/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `your total bill is ${totalPrice}`,
        to: number,
        data: obj
      })
    });
    const data = await res.json();
    if (data.status === 200) {
      window.alert("success");
      console.log(data);
    }
  };
  const onSubmit = () => {
    // PostData();
    let curr = 0;
    itemArr.map(item => {
      curr += item.Price * item.Quantity;
    });

    settotalPrice(curr);
    let obj = {
      userName: userName,
      phoneNo: phoneNo,
      email: email,
      item: itemArr,
      totalPrice: totalPrice
    };
    const newPostKey = push(child(ref(database), "posts")).key;
    const updates = {};
    updates["/" + newPostKey] = obj;
    setuserName("");
    setphoneNo("");
    setEmail("");
    setitemName("");
    setItemArr([]);
    setitemPrice([]);
    setitemQuantity([]);
    settotalPrice(0);
    return update(ref(database), updates);
  };

  const handleSubmit1 = () => {
    // e.preventDefault();
    console.log(itemName);
    let obj = {
      item: itemName,
      description: "Default Desc",
      amount: itemPrice,
      quantity: itemQuantity
    };

    settotalPrice(totalPrice + itemPrice * itemQuantity);
    console.log(totalPrice);
    setItemArr([...itemArr, obj]);
    setitemName("");
    setitemPrice("");
    setitemQuantity("");
    // setTimeout(() => {console.log(itemArr);}, 2000);
  };
  console.log(itemArr);
  const getQr = async e => {
    e.preventDefault();
    const res = await fetch("/qr1");
    const data = await res.json();
    setqr(data.qr1);
    console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-body">
          <div className="username">
            <label className="form__label" htmlFor="userName">
              User Name{" "}
            </label>
            <input
              className="form__input"
              {...register("name", registerOptions.name)}
              type="text"
              value={userName}
              onChange={e => handleInputChange(e)}
              id="userName"
              placeholder="User Name"
            />
            <small className="text-danger">
              {errors?.name && errors.name.message}
            </small>
          </div>

          <div className="phoneNo">
            <label className="form__label" htmlFor="phoneNo">
              Phone No.{" "}
            </label>
            <input
              type="text"
              name=""
              id="phoneNo"
              {...register("phoneNo", registerOptions.phoneNo)}
              value={phoneNo}
              className="form__input"
              onChange={e => handleInputChange(e)}
              placeholder="phoneNo"
            />
            <small className="text-danger">
              {errors?.phoneNo && errors.phoneNo.message}
            </small>
          </div>
          <div className="email">
            <label className="form__label" htmlFor="email">
              Email{" "}
            </label>
            <input
              type="email"
              id="email"
              className="form__input"
              {...register("email", registerOptions.email)}
              value={email}
              onChange={e => handleInputChange(e)}
              placeholder="Email"
            />
            <small className="text-danger">
              {errors?.email && errors.email.message}
            </small>
          </div>

          <div className="itemName">
            <label className="form__label" htmlFor="itemName">
              Item Name{" "}
            </label>
            <input
              type="text"
              id="itemName"
              className="form__input"
              value={itemName}
              onChange={e => setitemName(e.target.value)}
              placeholder="Item Name"
            />
            <input
              type="text"
              id="itemPrice"
              className="form__input"
              value={itemPrice}
              onChange={e => setitemPrice(e.target.value)}
              placeholder="Item Price"
            />
            <input
              type="text"
              id="itemQuantity"
              className="form__input"
              value={itemQuantity}
              onChange={e => setitemQuantity(e.target.value)}
              placeholder="Item Quantity"
            />
            <div onClick={() => handleSubmit1()} className="btn">
              Add
            </div>
          </div>
          {itemArr.map(item => {
            console.log(item.Price);
            return (
              <div>
                {item.item} : {item.amount} : {item.quantity}
              </div>
            );
          })}
        </div>
        <div className="footer">
          <button type="submit" className="btn">
            Submit
          </button>
        </div>
      </form>
      <form method="POST">
        <div className="footer">
          <div>
            <button onClick={getQr}>get Qr</button>
            {qr ? (
              <QRcode id="myqr" value={qr} size={320} includeMargin={true} />
            ) : (
              <button type="submit" onClick={PostData} className="btn">
                send WhastappMEssage
              </button>
            )}
          </div>
        </div>
      </form>
      <form method="POST">
        <div className="footer">
          <button type="submit" onClick={createInvoice} className="btn">
            CreateInvoice
          </button>
        </div>
      </form>
    </div>
  );
}

export default BillDetails;
