import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

const fetchUsers = async (page, limit) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${page}&_limit=${limit}`);
  const data = await response.json();
  return data;
};

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  useEffect(() => {
    // Carrega a primeira página de usuários
    const loadInitialUsers = async () => {
      setLoading(true);
      const data = await fetchUsers(page, limit);
      if (data.length < limit) {
        setHasMore(false);
      }
      setUsers(data);
      setLoading(false);
    };
    loadInitialUsers();
  }, []);

  const loadMoreUsers = async () => {
    if (loading || !hasMore) return; // Evita múltiplas requisições ou carregamento quando não há mais dados
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
