'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Play, Film, X, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { GalleryItem, GalleryAlbum } from '@/types';

// Mock Albums
const fallbackAlbums: GalleryAlbum[] = [
  { id: 'a1', title: 'Pottery Heritage & Craftsmanship', description: 'Traditional pottery and terracotta crafts.', cover_image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800', created_at: '' },
  { id: 'a2', title: 'Community Milan 2025', description: 'Highlights from the annual gathering in Jaipur.', cover_image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800', created_at: '' },
  { id: 'a3', title: 'Youth Skill Development Seminar', description: 'Technology and entrepreneurship seminars.', cover_image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800', created_at: '' }
];

// Mock Gallery Items
const fallbackGallery: GalleryItem[] = [
  { id: 'g1', album_id: 'a1', type: 'photo', url: 'https://images.unsplash.com/photo-1565192647048-f997ded87958?q=80&w=800', caption: 'Traditional pottery wheel crafting clay pots', created_at: '' },
  { id: 'g2', album_id: 'a1', type: 'photo', url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800', caption: 'Terracotta lamps dried in the sun', created_at: '' },
  { id: 'g3', album_id: 'a1', type: 'photo', url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800', caption: 'Intricate hand-painted clay pots', created_at: '' },
  { id: 'g4', album_id: 'a2', type: 'photo', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800', caption: 'Inauguration lamp lighting by community elders', created_at: '' },
  { id: 'g5', album_id: 'a2', type: 'photo', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800', caption: 'Traditional folk dance cultural performance', created_at: '' },
  { id: 'g6', album_id: 'a3', type: 'photo', url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800', caption: 'Keynote lecture on civil service preparations', created_at: '' },
  { id: 'g7', album_id: 'a3', type: 'photo', url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800', caption: 'Interactive session with youth developers', created_at: '' },
  
  // Video items (represent via embed or player url)
  { id: 'v1', album_id: 'a1', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4', caption: 'Artisan Wheel Spinning Video Demo', created_at: '' },
  { id: 'v2', album_id: 'a2', type: 'video', url: 'https://www.w3schools.com/html/movie.mp4', caption: 'Inauguration Highlights Reel', created_at: '' }
];

export default function GalleryPage() {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [selectedAlbumId, setSelectedAlbumId] = useState('All');
  const [selectedType, setSelectedType] = useState<'photo' | 'video'>('photo');

  // Lightbox Modal for Photo zoom or Video play
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function loadGalleryData() {
      setLoading(true);
      try {
        const [albumData, galleryData] = await Promise.all([
          supabase.from('gallery_albums').select('*'),
          supabase.from('gallery').select('*')
        ]);

        if (albumData.data && albumData.data.length > 0) {
          setAlbums(albumData.data as GalleryAlbum[]);
        } else {
          setAlbums(fallbackAlbums);
        }

        if (galleryData.data && galleryData.data.length > 0) {
          setItems(galleryData.data as GalleryItem[]);
        } else {
          setItems(fallbackGallery);
        }
      } catch {
        setAlbums(fallbackAlbums);
        setItems(fallbackGallery);
      } finally {
        setLoading(false);
      }
    }
    loadGalleryData();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesAlbum = selectedAlbumId === 'All' || item.album_id === selectedAlbumId;
    const matchesType = item.type === selectedType;
    return matchesAlbum && matchesType;
  });

  return (
    <div className="flex flex-col w-full pb-20 clay-pattern">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-700 text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading">
            Community Media Gallery
          </h1>
          <p className="text-sm text-orange-100 max-w-lg mx-auto">
            Browse through historical potter achievements, youth seminars, and community festival celebrations.
          </p>
        </div>
      </section>

      {/* Filter panel */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 w-full relative z-10">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Photos vs Videos tabs */}
          <div className="flex bg-background border border-input rounded-xl p-1 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setSelectedType('photo')}
              className={`flex-1 md:flex-initial md:px-6 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedType === 'photo' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Photos
            </button>
            <button
              onClick={() => setSelectedType('video')}
              className={`flex-1 md:flex-initial md:px-6 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                selectedType === 'video' ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <Film className="w-4 h-4" />
              Videos
            </button>
          </div>

          {/* Album Selector dropdown */}
          <div className="w-full md:w-64">
            <select
              value={selectedAlbumId}
              onChange={(e) => setSelectedAlbumId(e.target.value)}
              className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
            >
              <option value="All">All Albums</option>
              {albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))}
            </select>
          </div>

        </div>
      </section>

      {/* Gallery Items Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-card border border-border rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-3xl space-y-2">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto opacity-35" />
            <h3 className="font-heading font-bold text-lg text-foreground">No Media Found</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              No media files are uploaded under the selected filters at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="relative group overflow-hidden rounded-2xl border border-border aspect-square bg-stone-100 shadow-sm cursor-pointer hover:border-primary/50 transition-colors"
              >
                {/* Photo / Video Rendering */}
                {item.type === 'photo' ? (
                  <img src={item.url} alt={item.caption || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full relative flex items-center justify-center bg-stone-800">
                    {/* Video Placeholder icon */}
                    <span className="w-12 h-12 rounded-full bg-primary/95 text-white flex items-center justify-center hover:scale-105 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </span>
                  </div>
                )}

                {/* Caption Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  <span className="text-white text-xs font-bold line-clamp-2">{item.caption || 'Community Asset'}</span>
                  <span className="text-[10px] text-orange-200 mt-1 font-semibold flex items-center gap-0.5">
                    Click to View <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* LIGHTBOX PREVIEW OVERLAY */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          {/* Close button */}
          <button
            onClick={() => setActiveItem(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Preview"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Lightbox box */}
          <div className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center justify-center space-y-4">
            
            {activeItem.type === 'photo' ? (
              <img
                src={activeItem.url}
                alt={activeItem.caption || ''}
                className="max-w-full max-h-[70vh] object-contain rounded-xl border border-white/10"
              />
            ) : (
              <video
                src={activeItem.url}
                controls
                autoPlay
                className="max-w-full max-h-[70vh] object-contain rounded-xl border border-white/10"
              />
            )}

            {activeItem.caption && (
              <p className="text-sm text-stone-200 text-center max-w-lg leading-relaxed bg-stone-900/60 px-4 py-2 rounded-xl border border-stone-800">
                {activeItem.caption}
              </p>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
