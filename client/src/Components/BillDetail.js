import React, { useState, setState } from "react";
// import "./style.css";
import { database } from "../firebase";
import { ref, push, child, update } from "firebase/database";

function BillDetails() {
  const [userName, setuserName] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [itemName, setitemName] = useState("");
  const [itemArr, setItemArr] = useState([]);
  const [itemPrice, setitemPrice] = useState([]);
  const [itemQuantity, setitemQuantity] = useState([]);
  let [totalPrice, settotalPrice] = useState(0);

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

  const handleSubmit = () => {
    let curr = 0;
    itemArr.map(item => {
      curr += item.Price * item.Quantity;
    });

    totalPrice = curr;
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
    return update(ref(database), updates);
  };

  const handleSubmit1 = () => {
    console.log(itemName);
    let obj = {
      ItemName: itemName,
      Price: itemPrice,
      Quantity: itemQuantity
    };
    setItemArr([...itemArr, obj]);
    setitemName("");
    setitemPrice("");
    setitemQuantity("");
    // setTimeout(() => {console.log(itemArr);}, 2000);
  };
  console.log(itemArr);

  return (
    <div className="form">
      <div className="form-body">
        <div className="username">
          <label className="form__label" htmlFor="userName">
            User Name{" "}
          </label>
          <input
            className="form__input"
            type="text"
            value={userName}
            onChange={e => handleInputChange(e)}
            id="userName"
            placeholder="User Name"
          />
        </div>
        <div className="phoneNo">
          <label className="form__label" htmlFor="phoneNo">
            Phone No.{" "}
          </label>
          <input
            type="text"
            name=""
            id="phoneNo"
            value={phoneNo}
            className="form__input"
            onChange={e => handleInputChange(e)}
            placeholder="phoneNo"
          />
        </div>
        <div className="email">
          <label className="form__label" htmlFor="email">
            Email{" "}
          </label>
          <input
            type="email"
            id="email"
            className="form__input"
            value={email}
            onChange={e => handleInputChange(e)}
            placeholder="Email"
          />
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
          <button onClick={() => handleSubmit1()} type="submit" className="btn">
            Add
          </button>
        </div>
        {itemArr.map(item => {
          console.log(item.Price);
          return (
            <div>
              {item.ItemName} : {item.Price} : {item.Quantity}
            </div>
          );
        })}
      </div>
      <div className="footer">
        <button onClick={() => handleSubmit()} type="submit" className="btn">
          Submit
        </button>
      </div>
    </div>
  );
}

export default BillDetails;
