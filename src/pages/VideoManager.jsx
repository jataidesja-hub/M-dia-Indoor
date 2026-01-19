import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { db, collections } from '../firebase';
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import './VideoManager.css';

const VideoManager = () => {
    const [availableVideos, setAvailableVideos] = useState([]);
    const [playlist, setPlaylist] = useState([]);

    useEffect(() => {
        const unsubClients = onSnapshot(collection(db, collections.CLIENTS), (snap) => {
            const videos = snap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(c => c.status === 'Ativo' && c.videoUrl);
            setAvailableVideos(videos);
        });

        const unsubPlaylist = onSnapshot(doc(db, 'global', 'playlist'), (snap) => {
            if (snap.exists()) {
                setPlaylist(snap.data().items || []);
            }
        });

        return () => { unsubClients(); unsubPlaylist(); };
    }, []);

    const addToPlaylist = async (video) => {
        const newItem = {
            id: video.id + Date.now(),
            originalId: video.id,
            videoName: video.videoName,
            videoUrl: video.videoUrl,
            name: video.name
        };
        const newPlaylist = [...playlist, newItem];
        await setDoc(doc(db, 'global', 'playlist'), { items: newPlaylist });
    };

    const removeFromPlaylist = async (id) => {
        const newPlaylist = playlist.filter(item => item.id !== id);
        await setDoc(doc(db, 'global', 'playlist'), { items: newPlaylist });
    };

    const moveItem = async (index, direction) => {
        const newPlaylist = [...playlist];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex >= 0 && newIndex < newPlaylist.length) {
            [newPlaylist[index], newPlaylist[newIndex]] = [newPlaylist[newIndex], newPlaylist[index]];
            await setDoc(doc(db, 'global', 'playlist'), { items: newPlaylist });
        }
    };

    return (
        <div className="manager-container">
            <header className="manager-header">
                <h1>Grade de Exibição</h1>
            </header>

            <div className="dash-two-columns">
                <section className="glass p-4">
                    <h3>Vídeos Disponíveis</h3>
                    <div className="video-list-grid mt-4">
                        {availableVideos.map(video => (
                            <div key={video.id} className="video-card-mini glass">
                                <div className="info">
                                    <p><strong>{video.videoName}</strong></p>
                                    <span>{video.name}</span>
                                </div>
                                <button className="icon-btn success" onClick={() => addToPlaylist(video)}><Plus size={16} /></button>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="glass p-4">
                    <h3>Playlist em Reprodução</h3>
                    <div className="playlist-order-list mt-4">
                        {playlist.map((item, index) => (
                            <div key={item.id} className="playlist-item glass">
                                <div className="order-number">{index + 1}</div>
                                <div className="playlist-item-info">
                                    <p className="title">{item.videoName}</p>
                                    <p className="subtitle">{item.name}</p>
                                </div>
                                <div className="playlist-item-actions">
                                    <button className="icon-btn" onClick={() => moveItem(index, 'up')} disabled={index === 0}><ArrowUp size={16} /></button>
                                    <button className="icon-btn" onClick={() => moveItem(index, 'down')} disabled={index === playlist.length - 1}><ArrowDown size={16} /></button>
                                    <button className="icon-btn delete" onClick={() => removeFromPlaylist(item.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default VideoManager;
