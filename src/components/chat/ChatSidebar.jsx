import React, { useEffect, useState } from 'react';
import { Plus, MessageSquare, Trash2, X, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getCurrentUserId } from '../../utils/userSession';

export default function ChatSidebar({
    isOpen,
    onClose,
    onNewChat,
    onSelectChat,
    currentConversationId,
    user,
    highContrast
}) {
    const [conversations, setConversations] = useState([]);

    useEffect(() => {
        if (!db) return;

        const uid = getCurrentUserId(user);

        // specific to user
        const q = query(
            collection(db, "conversations"),
            where("userId", "==", uid)
            // orderBy("createdAt", "desc") // Temporarily removed to fix missing index issue
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const convs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setConversations(convs);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Delete this chat?")) {
            try {
                await deleteDoc(doc(db, "conversations", id));
                // Also logically should delete sub-messages or filtered messages, 
                // but for MVP we just delete the parent doc to hide it.
                if (currentConversationId === id) {
                    onNewChat();
                }
            } catch (error) {
                console.error("Error deleting chat:", error);
            }
        }
    };

    const sidebarClasses = `
    fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    ${highContrast ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'}
  `;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={onClose}
                />
            )}

            <div className={sidebarClasses}>
                <div className="p-4 flex flex-col h-full">

                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className={`font-bold text-lg ${highContrast ? 'text-yellow-400' : 'text-gray-800'}`}>
                            History
                        </h2>
                        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-md transition-colors">
                            <X size={20} className={highContrast ? 'text-gray-400' : 'text-gray-500'} />
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <button
                        onClick={onNewChat}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-4 transition-all font-medium ${highContrast
                            ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                            }`}
                    >
                        <Plus size={20} />
                        New Chat
                    </button>

                    {/* Conversation List */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {conversations.length === 0 ? (
                            <div className={`text-center py-8 text-sm ${highContrast ? 'text-gray-600' : 'text-gray-400'}`}>
                                No recent chats
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => onSelectChat(conv.id)}
                                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${currentConversationId === conv.id
                                        ? (highContrast ? 'bg-gray-800 text-yellow-400' : 'bg-blue-50 text-blue-700')
                                        : (highContrast ? 'text-gray-400 hover:bg-gray-800/50' : 'text-gray-600 hover:bg-gray-50')
                                        }`}
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <MessageSquare size={18} className="shrink-0" />
                                        <span className="truncate text-sm font-medium">
                                            {conv.title || "Untitled Chat"}
                                        </span>
                                    </div>

                                    <button
                                        onClick={(e) => handleDelete(e, conv.id)}
                                        className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 hover:text-red-500 transition-all ${highContrast ? 'hover:bg-red-900/30' : ''
                                            }`}
                                        title="Delete chat"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className={`mt-4 pt-4 border-t text-xs text-center ${highContrast ? 'border-gray-800 text-gray-600' : 'border-gray-100 text-gray-400'}`}>
                        Vaani v1.0
                    </div>
                </div>
            </div>
        </>
    );
}
