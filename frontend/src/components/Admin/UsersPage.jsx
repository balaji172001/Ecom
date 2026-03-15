import { useState, useEffect } from "react";
import { API_BASE } from "../../utils/shopConstants";
import { EmptyState } from "./Common";

export default function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${API_BASE}/api/admin/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchUsers();
    }, []);

    return (
        <div className="adm-style-129">
            <div className="adm-style-102">
                <h1 className="page-title">User Management</h1>
                <div className="adm-style-103">View registered customers and their contact information</div>
            </div>

            <div className="adm-style-104">
                <table className="adm-style-105">
                    <thead>
                        <tr className="adm-style-106">
                            <th className="adm-style-107">Name</th>
                            <th className="adm-style-107">Mobile</th>
                            <th className="adm-style-107">Email</th>
                            <th className="adm-style-107">Joined Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id} className="adm-style-108">
                                <td className="adm-style-109">{u.name}</td>
                                <td className="adm-style-110">{u.mobile}</td>
                                <td className="adm-style-111">{u.email || "N/A"}</td>
                                <td className="adm-style-114">{new Date(u.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && users.length === 0 && <EmptyState icon="👥" msg="No registered users found" />}
            </div>
        </div>
    );
}
