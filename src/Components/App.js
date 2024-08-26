import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: 0,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 0,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [select, setSelect] = useState(null);

  function handleClickAdd() {
    setShowAddFriend((prev) => !prev);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(!showAddFriend);
  }

  function handleSelect(friend) {
    setSelect((prev) => (prev?.id === friends.id ? friend : null));
    setShowAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === select.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelect(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelect={handleSelect}
          selectedFriend={select}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleClickAdd}>
          {!showAddFriend ? "Add friend" : "Close"}
        </Button>
      </div>
      {select && (
        <FormSplitBill friend={select} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
}

function FriendList({ friends, onSelect, selectedFriend }) {
  return (
    <ul>
      {friends.map((el) => (
        <Friend
          friendsProp={el}
          key={el.id}
          onSelect={onSelect}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friendsProp, onSelect, selectedFriend }) {
  const isSelected = selectedFriend?.id === friendsProp.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friendsProp.image} alt={friendsProp.name} />
      <h3>{friendsProp.name}</h3>

      {friendsProp.balance < 0 && (
        <p className="red">
          You owe {friendsProp.name} ${Math.abs(friendsProp.balance)}
        </p>
      )}

      {friendsProp.balance > 0 && (
        <p className="green">
          {friendsProp.name} owes you ${friendsProp.balance}
        </p>
      )}

      {friendsProp.balance === 0 && (
        <p>
          You and {friendsProp.name} are even ${friendsProp.balance}
        </p>
      )}

      <Button onClick={() => onSelect(friendsProp)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [friend, setFriend] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();

    if (!friend || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      image: `${image}?=${id}`,
      name: friend,
      balance: 0,
    };

    onAddFriend(newFriend);

    setFriend("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👨Friend Name</label>
      <input
        type="text"
        value={friend}
        onChange={(e) => setFriend(e.target.value)}
      />

      <label>🖼️Img url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userPaid, setUserPaid] = useState("");
  const [whoPaid, setWhoPaid] = useState("user");

  const expense = bill ? bill - userPaid : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userPaid) return;

    onSplitBill(whoPaid === "user" ? expense : -userPaid);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split bill with {friend.name}</h2>

      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🙆‍♂️Your expense</label>
      <input
        type="text"
        value={userPaid}
        onChange={(e) =>
          setUserPaid(
            Number(e.target.value) > bill ? userPaid : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑{friend.name}'s expense</label>
      <input type="text" disabled value={expense} />

      <label>🤑Who is paying the bill</label>
      <select value={whoPaid} onChange={(e) => setWhoPaid(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{friend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
