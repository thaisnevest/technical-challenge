import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

// function to fetch API users based on page and limit provided
const fetchUsers = async (page, limit) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${limit}`);
  const data = await response.json();
  return data;
};

function App() {
  // states to perform desired functions
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    // function to load the first page of users
    const loadInitialUsers = async () => {
      setLoading(true);
      const data = await fetchUsers(page, limit);
      if (data.length < limit) {
        setHasMore(false); // if the amount of data is less than the limit, there is no more data to load
      }
      setUsers(data);
      setLoading(false);
    };
    loadInitialUsers();
  }, []);

  // function to load more users when user scrolls down
  const loadMoreUsers = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newPage = page + 1;
    const data = await fetchUsers(newPage, limit);
    if (data.length < limit) {
      setHasMore(false);
    }
    setUsers(prevUsers => [...prevUsers, ...data]);
    setPage(newPage);
    setLoading(false);
  };

  // function to add a new user
  const addUser = () => {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();
    if (name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify({ name, email, website }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      })
        .then(response => response.json())
        .then(data => {
          setUsers([...users, data]);
          setNewName("");
          setNewEmail("");
          setNewWebsite("");
          alert("User added successfully");
        });
    }
  };

  // function to update a user 
  const updateUser = id => {
    const user = users.find(user => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    })
      .then(response => response.json())
      .then(() => {
        alert("User updated successfully");
      });
  };

  // function to delete a user 
  const deleteUser = id => {
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(() => {
        setUsers(values => values.filter(item => item.id !== id));
        alert("User deleted successfully");
      });
  };

  // function to update email and website of a user
  const onChangeHandler = (id, key, value) => {
    setUsers(values => values.map(item =>
      item.id === id ? { ...item, [key]: value } : item
    ));
  };

  return (
    <div className="App">
      <InfiniteScroll
        dataLength={users.length}
        next={loadMoreUsers} 
        hasMore={hasMore}
        loader={<h4>Loading...</h4>} 
        endMessage={<p>No more users to load</p>}
      >
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>email</th>
              <th>website</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>
                  <input
                    type="text"
                    value={user.email}
                    onChange={(e) => onChangeHandler(user.id, "email", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={user.website}
                    onChange={(e) => onChangeHandler(user.id, "website", e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => updateUser(user.id)}>
                    Update
                  </button>
                  &nbsp;
                  <button onClick={() => deleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Add name here..."
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="Add email here..."
                />
              </td>
              <td>
                <input
                  type="text"
                  value={newWebsite}
                  onChange={e => setNewWebsite(e.target.value)}
                  placeholder="Add website here..."
                />
              </td>
              <td>
                <button onClick={addUser}>
                  Add user
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </InfiniteScroll>
    </div>
  );
}

export default App;
