import React from 'react';
import { Shield, ShieldAlert, User, Phone, Mail } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const UserManageTable = ({ users, onRoleChange, currentUserId }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="px-5 py-3.5">User</th>
              <th className="px-5 py-3.5">Contact Details</th>
              <th className="px-5 py-3.5">Activity</th>
              <th className="px-5 py-3.5">Joined Date</th>
              <th className="px-5 py-3.5">Role</th>
              <th className="px-5 py-3.5 text-right">Role Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => {
              const isCurrentUser = user._id === currentUserId;
              const isAdmin = user.role === 'admin';

              return (
                <tr key={user._id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{user.name}</p>
                        {isCurrentUser && (
                          <span className="text-[10px] text-brand-600 font-semibold">(You)</span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 space-y-0.5">
                    <p className="text-slate-700 flex items-center">
                      <Mail className="w-3 h-3 mr-1 text-slate-400" />
                      {user.email}
                    </p>
                    {user.phone && (
                      <p className="text-[11px] text-slate-500 flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-slate-400" />
                        {user.phone}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    <span className="font-semibold text-slate-800">{user.itemsReported || 0}</span> reports &bull; <span className="font-semibold text-slate-800">{user.claimsMade || 0}</span> claims
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-5 py-4">
                    {isAdmin ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        <Shield className="w-3 h-3 mr-1 text-purple-600" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        <User className="w-3 h-3 mr-1 text-slate-400" />
                        User
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-right">
                    {!isCurrentUser ? (
                      <button
                        onClick={() => onRoleChange(user._id, isAdmin ? 'user' : 'admin')}
                        className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition border ${
                          isAdmin
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        {isAdmin ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs italic">Current Account</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManageTable;
