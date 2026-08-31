'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bike,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  LocateFixed,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  UserRound,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type View = 'home' | 'menu' | 'checkout' | 'tracking' | 'saved';
type CartItem = { id: string; name: string; description: string; price: number; calories: number; image: string; qty: number };

const restaurants = [
  { name: 'Jollibee', type: 'Fried Chicken · Burgers · Filipino', time: '22 min', fee: '$0 delivery fee', rating: '4.8', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=1200&q=85' },
  { name: "McDonald's", type: 'Burgers · Fries · Late Night', time: '18 min', fee: '$0 delivery fee', rating: '4.7', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Wingstop', type: 'Wings · Chicken · Fries', time: '27 min', fee: '$1.49 delivery fee', rating: '4.6', image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Popeyes', type: 'Fried Chicken · Sandwiches · Biscuits', time: '24 min', fee: '$0 delivery fee', rating: '4.7', image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Taco Bell', type: 'Tacos · Burritos · Late Night', time: '20 min', fee: '$0 delivery fee', rating: '4.5', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=1200&q=85' },
  { name: 'Shake Shack', type: 'Burgers · Shakes · Fries', time: '31 min', fee: '$2.49 delivery fee', rating: '4.8', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=85' },
];

const menuItems: Omit<CartItem, 'qty'>[] = [
  { id: 'chicken', name: 'Crispy Chicken Meal', description: 'Two pieces of crispy fried chicken, seasoned fries, buttery biscuit, gravy, and a cold drink', price: 13.99, calories: 1240, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=900&q=85' },
  { id: 'burger', name: 'Double Cheeseburger Combo', description: 'Two beef patties, melted American cheese, pickles, onions, special sauce, fries, and a drink', price: 12.49, calories: 1380, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85' },
  { id: 'wings', name: '10 Piece Wings', description: 'Ten crispy wings tossed in your choice of sauce with seasoned fries and ranch', price: 17.95, calories: 1560, image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=900&q=85' },
  { id: 'tacos', name: 'Crunchy Taco Party Pack', description: 'Six crunchy beef tacos loaded with lettuce, shredded cheese, hot sauce, and nacho fries', price: 15.49, calories: 1710, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=85' },
];

const categories = ['All', 'Fried Chicken', 'Burgers', 'Wings', 'Tacos', 'Late Night'];

function Brand() {
  return <button className="flex items-center gap-2 text-[21px] font-black tracking-[-1px] text-[#eb1700]"><span className="grid size-8 place-items-center rounded-full bg-[#eb1700] text-white"><Bike className="size-[19px]" /></span>DASHLESS</button>;
}

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState(restaurants[0]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [location, setLocation] = useState('Detecting your location…');
  const [locationDetail, setLocationDetail] = useState('Current location');
  const [locating, setLocating] = useState(true);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [deliveredToast, setDeliveredToast] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const calories = cart.reduce((sum, item) => sum + item.calories * item.qty, 0);
  const tax = subtotal * 0.0875;
  const total = subtotal + tax;

  const visibleRestaurants = useMemo(() => restaurants.filter((restaurant) => {
    const matchesQuery = `${restaurant.name} ${restaurant.type}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === 'All' || restaurant.type.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesQuery && matchesCategory;
  }), [query, activeCategory]);

  const detectLocation = () => {
    setLocating(true);
    setLocation('Detecting your location…');
    if (!navigator.geolocation) {
      setLocation('San Francisco, CA'); setLocationDetail('1 Market St, San Francisco'); setLocating(false); return;
    }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`);
        const data = await response.json();
        const city = data.address?.city || data.address?.town || data.address?.village || 'Current location';
        const region = data.address?.state_code || data.address?.state || '';
        setLocation(`${city}${region ? `, ${region}` : ''}`);
        setLocationDetail(data.display_name?.split(',').slice(0, 3).join(',') || `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
      } catch {
        setLocation(`${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)}`);
        setLocationDetail('Your current coordinates');
      } finally { setLocating(false); }
    }, () => {
      setLocation('San Francisco, CA'); setLocationDetail('1 Market St, San Francisco'); setLocating(false);
    }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 });
  };

  useEffect(() => { detectLocation(); }, []);

  useEffect(() => {
    if (view !== 'tracking') return;
    const delivery = window.setTimeout(() => setDeliveredToast(true), 8000);
    const reveal = window.setTimeout(() => { setDeliveredToast(false); setView('saved'); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 10200);
    return () => { window.clearTimeout(delivery); window.clearTimeout(reveal); };
  }, [view]);

  const addItem = (item: Omit<CartItem, 'qty'>) => {
    setCart((current) => current.some(({ id }) => id === item.id) ? current.map((entry) => entry.id === item.id ? { ...entry, qty: entry.qty + 1 } : entry) : [...current, { ...item, qty: 1 }]);
    setCartOpen(true);
  };

  const changeQty = (id: string, change: number) => setCart((current) => current.map((item) => item.id === id ? { ...item, qty: item.qty + change } : item).filter((item) => item.qty > 0));

  const openRestaurant = (restaurant: typeof restaurants[number]) => { setSelectedRestaurant(restaurant); setView('menu'); window.scrollTo(0, 0); };

  const Header = () => (
    <header className="sticky top-0 z-30 border-b border-[#e7e7e7] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-4 px-4 lg:px-10">
        {view === 'home' ? <Brand /> : <button aria-label="Go back" onClick={() => { setView(view === 'menu' ? 'home' : view === 'checkout' ? 'menu' : 'home'); setCartOpen(false); }} className="grid size-10 place-items-center rounded-full hover:bg-[#f4f4f4]"><ArrowLeft /></button>}
        <button onClick={detectLocation} className="hidden min-w-0 items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-3 text-sm font-semibold md:flex"><MapPin className="size-4 shrink-0 text-[#eb1700]" /><span className="max-w-[210px] truncate">{location}</span>{locating ? <span className="size-3 animate-spin rounded-full border-2 border-[#aaa] border-t-[#eb1700]" /> : <ChevronDown className="size-4" />}</button>
        {view === 'home' && <div className="relative mx-auto hidden w-full max-w-[430px] md:block"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5c5c5c]" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search restaurants and dishes" className="h-12 w-full rounded-full bg-[#f4f4f4] pl-12 pr-4 text-sm outline-none ring-[#191919] transition focus:ring-2" placeholder="Search restaurants and dishes" /></div>}
        {view !== 'home' && <div className="mx-auto font-extrabold">{view === 'menu' ? selectedRestaurant.name : view === 'checkout' ? 'Checkout' : view === 'tracking' ? 'Order status' : 'Your savings'}</div>}
        <Button variant="ghost" className="ml-auto hidden h-10 rounded-full px-4 font-bold sm:flex"><UserRound /> Sign in</Button>
        <button onClick={() => setCartOpen(true)} aria-label={`Open cart with ${cartCount} items`} className="relative grid size-11 place-items-center rounded-full hover:bg-[#f4f4f4]"><ShoppingCart className="size-5" />{cartCount > 0 && <span className="absolute right-0 top-0 grid size-5 place-items-center rounded-full bg-[#eb1700] text-[10px] font-black text-white">{cartCount}</span>}</button>
      </div>
    </header>
  );

  return (
    <main className="min-h-screen bg-white text-[#191919]">
      <Header />

      {view === 'home' && <section className="mx-auto max-w-[1440px] px-4 pb-16 pt-7 lg:px-10">
        <div className="rounded-[26px] bg-[#fff1ee] px-6 py-8 md:flex md:items-center md:justify-between md:px-10 md:py-10">
          <div><p className="mb-2 text-xs font-black uppercase tracking-[.16em] text-[#eb1700]">Delivery, with a twist</p><h1 className="max-w-2xl text-4xl font-black tracking-[-1.8px] md:text-5xl">What are you craving?</h1><p className="mt-3 max-w-xl text-base text-[#555]">Order anything you want. We’ll track the calories and cash you keep when plans change.</p></div>
          <button onClick={detectLocation} className="mt-6 flex max-w-md items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-sm md:mt-0"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fff1ee] text-[#eb1700]"><LocateFixed className="size-5" /></span><div className="min-w-0"><p className="text-xs font-bold text-[#767676]">DELIVER TO</p><p className="truncate font-extrabold">{location}</p><p className="truncate text-xs text-[#777]">{locationDetail}</p></div></button>
        </div>
        <div className="relative mt-5 md:hidden"><Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5c5c5c]" /><input value={query} onChange={(event) => setQuery(event.target.value)} className="h-12 w-full rounded-full bg-[#f4f4f4] pl-12 pr-4 text-sm outline-none" placeholder="Search restaurants and dishes" /></div>
        <div className="mt-7 flex gap-3 overflow-x-auto pb-2 no-scrollbar">{categories.map((category) => <button onClick={() => setActiveCategory(category)} key={category} className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${activeCategory === category ? 'bg-[#191919] text-white' : 'bg-[#f4f4f4] hover:bg-[#e8e8e8]'}`}>{category}</button>)}</div>
        <div className="mt-8 flex items-end justify-between"><div><h2 className="text-2xl font-black tracking-[-.7px]">Fastest near you</h2><p className="mt-1 text-sm text-[#666]">Popular picks that can be at your door soon</p></div><button className="hidden text-sm font-bold underline md:block">See all</button></div>
        {visibleRestaurants.length ? <div className="mt-5 grid gap-x-7 gap-y-10 md:grid-cols-2 lg:grid-cols-3">{visibleRestaurants.map((restaurant) => <button onClick={() => openRestaurant(restaurant)} key={restaurant.name} className="group overflow-hidden text-left"><div className="relative aspect-[1.65] overflow-hidden rounded-2xl bg-[#eee]"><img src={restaurant.image} alt={`${restaurant.name} food`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" /><span className="absolute bottom-3 left-3 rounded-md bg-white px-2.5 py-1.5 text-xs font-black shadow-sm">{restaurant.time}</span></div><div className="mt-3 flex items-start justify-between gap-4"><div><h3 className="text-lg font-black">{restaurant.name}</h3><p className="mt-0.5 text-sm text-[#666]">{restaurant.type}</p><p className="mt-1 text-sm font-semibold">{restaurant.fee}</p></div><span className="flex items-center gap-1 rounded-full bg-[#f4f4f4] px-2 py-1 text-sm font-bold"><Star className="size-3.5 fill-current" />{restaurant.rating}</span></div></button>)}</div> : <div className="mt-16 text-center"><p className="text-xl font-black">No restaurants found</p><button onClick={() => { setQuery(''); setActiveCategory('All'); }} className="mt-3 font-bold text-[#eb1700]">Clear filters</button></div>}
      </section>}

      {view === 'menu' && <section className="pb-32">
        <div className="relative h-[230px] overflow-hidden bg-[#eee] md:h-[330px]"><img src={selectedRestaurant.image} alt={`${selectedRestaurant.name} food spread`} className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" /></div>
        <div className="mx-auto max-w-5xl px-4 lg:px-8"><div className="relative -mt-14 rounded-2xl bg-white p-6 shadow-[0_8px_28px_rgb(0_0_0/10%)] md:p-8"><div className="flex items-start justify-between"><div><h1 className="text-3xl font-black tracking-[-1px] md:text-4xl">{selectedRestaurant.name}</h1><p className="mt-2 text-sm text-[#666]">{selectedRestaurant.type}</p></div><span className="flex items-center gap-1 rounded-full bg-[#f4f4f4] px-3 py-2 text-sm font-bold"><Star className="size-3.5 fill-current" />{selectedRestaurant.rating}</span></div><div className="mt-5 flex flex-wrap gap-5 border-t pt-5 text-sm font-semibold"><span className="flex items-center gap-2"><Clock3 className="size-4" />{selectedRestaurant.time}</span><span>{selectedRestaurant.fee}</span><span>$0.00 min</span></div></div>
          <h2 className="mb-4 mt-10 text-2xl font-black">Most ordered</h2>
          <div className="grid gap-4 md:grid-cols-2">{menuItems.map((item) => <article key={item.id} className="flex min-h-[170px] overflow-hidden rounded-2xl border border-[#e2e2e2] bg-white transition hover:shadow-md"><div className="flex flex-1 flex-col p-5"><h3 className="font-black">{item.name}</h3><p className="mt-2 line-clamp-3 text-sm leading-5 text-[#666]">{item.description}</p><p className="mt-2 text-sm font-bold">${item.price.toFixed(2)}</p><button onClick={() => addItem(item)} className="mt-auto flex w-fit items-center gap-1.5 rounded-full bg-[#eb1700] px-4 py-2 text-sm font-black text-white hover:bg-[#c61400]"><Plus className="size-4" />Add</button></div><img src={item.image} alt={item.name} className="w-[38%] object-cover" /></article>)}</div>
        </div>
      </section>}

      {view === 'checkout' && <section className="mx-auto grid max-w-5xl gap-8 px-4 py-8 md:grid-cols-[1fr_360px] md:px-8 md:py-12">
        <div className="space-y-4"><div className="rounded-2xl border p-6"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-[#fff1ee] text-[#eb1700]"><MapPin className="size-5" /></span><div><p className="text-sm text-[#666]">Delivery address</p><p className="font-black">{locationDetail}</p></div><button onClick={detectLocation} className="ml-auto text-sm font-bold text-[#eb1700]">Edit</button></div></div><div className="rounded-2xl border p-6"><h2 className="text-xl font-black">Payment</h2><div className="mt-5 flex items-center gap-3"><span className="grid h-9 w-12 place-items-center rounded-md bg-[#161d3a] text-xs font-black text-white">VISA</span><div><p className="font-bold">•••• 4242</p><p className="text-sm text-[#666]">Personal</p></div><ChevronRight className="ml-auto size-5" /></div></div><div className="rounded-2xl border p-6"><h2 className="text-xl font-black">Delivery instructions</h2><textarea className="mt-4 min-h-24 w-full rounded-xl bg-[#f6f6f6] p-4 text-sm outline-none focus:ring-2" placeholder="Add gate code, drop-off notes, or anything else…" /></div></div>
        <aside className="h-fit rounded-2xl border p-6 md:sticky md:top-24"><h2 className="text-xl font-black">Order summary</h2><div className="my-5 space-y-4">{cart.map((item) => <div key={item.id} className="flex gap-3"><span className="grid size-7 shrink-0 place-items-center rounded-md border text-xs font-bold">{item.qty}</span><p className="flex-1 text-sm font-semibold">{item.name}</p><p className="text-sm font-bold">${(item.price * item.qty).toFixed(2)}</p></div>)}</div><div className="space-y-2 border-t pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span>Delivery fee</span><span className="font-bold text-[#198754]">$0.00</span></div><div className="flex justify-between"><span>Taxes & fees</span><span>${tax.toFixed(2)}</span></div><div className="mt-3 flex justify-between text-lg font-black"><span>Total</span><span>${total.toFixed(2)}</span></div></div><Button onClick={() => { setView('tracking'); window.scrollTo(0, 0); }} className="mt-6 h-13 w-full rounded-full bg-[#eb1700] text-base font-black hover:bg-[#c61400]">Place order · ${total.toFixed(2)}</Button></aside>
      </section>}

      {view === 'tracking' && <section className="mx-auto grid max-w-6xl gap-0 md:min-h-[calc(100vh-72px)] md:grid-cols-[440px_1fr]">
        <div className="order-2 p-6 md:order-1 md:p-10"><p className="text-sm font-black uppercase tracking-[.12em] text-[#eb1700]">Order confirmed</p><h1 className="mt-3 text-4xl font-black tracking-[-1.5px]">It’s on the way</h1><p className="mt-3 text-lg text-[#555]">Your order is expected in about <strong>1 hour</strong>.</p><div className="my-8 h-2 overflow-hidden rounded-full bg-[#eee]"><div className="h-full w-[58%] animate-pulse rounded-full bg-[#eb1700]" /></div><div className="space-y-6"><div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e9f7ef] text-[#198754]"><Check className="size-5" /></span><div><p className="font-black">Order confirmed</p><p className="text-sm text-[#666]">The restaurant received your order</p></div></div><div className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#fff1ee] text-[#eb1700]"><Bike className="size-5" /></span><div><p className="font-black">Your driver has your order</p><p className="text-sm text-[#666]">Alex is heading your way</p></div></div><div className="ml-[21px] h-8 border-l-2 border-dashed border-[#ccc]" /><div className="flex gap-4 opacity-45"><span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f2f2f2]"><MapPin className="size-5" /></span><div><p className="font-black">Delivered</p><p className="text-sm text-[#666]">Leave at your door</p></div></div></div><div className="mt-9 flex items-center gap-3 rounded-2xl border p-4"><span className="grid size-12 place-items-center rounded-full bg-[#191919] font-black text-white">A</span><div><p className="text-xs font-bold text-[#777]">YOUR DRIVER</p><p className="font-black">Alex · 4.96 ★</p></div><button className="ml-auto rounded-full bg-[#f4f4f4] px-4 py-2 text-sm font-bold">Message</button></div><button onClick={() => { setDeliveredToast(true); window.setTimeout(() => { setDeliveredToast(false); setView('saved'); window.scrollTo(0, 0); }, 1400); }} className="mt-5 w-full text-center text-xs font-bold text-[#777] underline">Fast-forward delivery demo</button></div>
        <div className="relative order-1 min-h-[370px] overflow-hidden bg-[#f2efe9] md:order-2 md:min-h-full"><div className="absolute inset-0 opacity-55" style={{ backgroundImage: 'linear-gradient(28deg, transparent 48%, #d4d0c7 49%, #d4d0c7 51%, transparent 52%), linear-gradient(104deg, transparent 46%, #dedad2 47%, #dedad2 50%, transparent 51%)', backgroundSize: '110px 90px, 145px 120px' }} /><div className="route-line absolute left-[25%] top-[62%] h-1 w-[48%] -rotate-[28deg] rounded-full bg-[#eb1700]" /><span className="absolute left-[23%] top-[66%] grid size-12 place-items-center rounded-full border-4 border-white bg-[#191919] text-white shadow-lg"><MapPin className="size-5" /></span><span className="absolute left-[69%] top-[32%] grid size-14 place-items-center rounded-full border-4 border-white bg-[#eb1700] text-white shadow-lg"><Bike className="size-6" /></span><div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-xl bg-white px-5 py-3 text-center shadow-lg"><p className="text-xs font-bold text-[#777]">ESTIMATED ARRIVAL</p><p className="font-black">8:15 – 8:25 PM</p></div></div>
      </section>}

      {view === 'saved' && <section className="saved-bg min-h-[calc(100vh-72px)] px-4 py-12 md:py-20"><div className="mx-auto max-w-3xl text-center"><span className="mx-auto grid size-20 place-items-center rounded-full bg-[#eb1700] text-white shadow-[0_16px_40px_rgb(235_23_0/25%)]"><Sparkles className="size-9" /></span><p className="mt-7 text-sm font-black uppercase tracking-[.16em] text-[#eb1700]">Plot twist</p><h1 className="mt-3 text-4xl font-black tracking-[-2px] md:text-6xl">Look what you saved.</h1><p className="mx-auto mt-4 max-w-xl text-lg text-[#555]">The order says delivered. Your wallet and your calorie count say congratulations.</p><div className="mt-10 grid gap-4 sm:grid-cols-2"><div className="rounded-[24px] border border-[#eadfdc] bg-white p-8 text-left shadow-[0_12px_35px_rgb(0_0_0/5%)]"><span className="grid size-12 place-items-center rounded-full bg-[#e9f7ef] text-[#16824b]"><CircleDollarSign className="size-6" /></span><p className="mt-6 text-sm font-bold uppercase tracking-[.1em] text-[#777]">Money saved</p><p className="mt-1 text-5xl font-black tracking-[-2px] text-[#16824b]">${total.toFixed(2)}</p><p className="mt-3 text-sm text-[#666]">That’s one tiny financial victory.</p></div><div className="rounded-[24px] border border-[#eadfdc] bg-white p-8 text-left shadow-[0_12px_35px_rgb(0_0_0/5%)]"><span className="grid size-12 place-items-center rounded-full bg-[#fff1ee] text-[#eb1700]"><Zap className="size-6" /></span><p className="mt-6 text-sm font-bold uppercase tracking-[.1em] text-[#777]">Calories saved</p><p className="mt-1 text-5xl font-black tracking-[-2px] text-[#eb1700]">{calories.toLocaleString()}</p><p className="mt-3 text-sm text-[#666]">Your future snack drawer is impressed.</p></div></div><div className="mt-6 rounded-2xl bg-[#191919] px-6 py-5 text-white"><p className="text-lg font-black">100% saved. 0% eaten. Iconic.</p></div><Button onClick={() => { setCart([]); setView('home'); }} className="mt-8 h-13 rounded-full bg-[#eb1700] px-8 text-base font-black hover:bg-[#c61400]">Back to restaurants</Button></div></section>}

      {cartOpen && <><button aria-label="Close cart" onClick={() => setCartOpen(false)} className="fixed inset-0 z-40 cursor-default bg-black/35" /><aside className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[430px] flex-col bg-white shadow-2xl"><div className="flex items-center border-b p-5"><h2 className="text-xl font-black">Your cart</h2><button onClick={() => setCartOpen(false)} className="ml-auto grid size-10 place-items-center rounded-full bg-[#f4f4f4]"><X /></button></div>{cart.length ? <><div className="flex-1 overflow-y-auto p-5"><p className="mb-5 text-sm font-bold text-[#666]">{selectedRestaurant.name}</p><div className="space-y-5">{cart.map((item) => <div key={item.id} className="flex gap-3"><img src={item.image} alt="" className="size-20 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="font-black">{item.name}</p><p className="mt-1 text-sm font-bold">${(item.price * item.qty).toFixed(2)}</p><div className="mt-2 flex w-fit items-center gap-3 rounded-full bg-[#f4f4f4] p-1"><button onClick={() => changeQty(item.id, -1)} className="grid size-7 place-items-center rounded-full bg-white"><Minus className="size-3" /></button><span className="text-sm font-black">{item.qty}</span><button onClick={() => changeQty(item.id, 1)} className="grid size-7 place-items-center rounded-full bg-white"><Plus className="size-3" /></button></div></div></div>)}</div></div><div className="border-t p-5"><div className="mb-4 flex justify-between text-lg font-black"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div><Button onClick={() => { setCartOpen(false); setView('checkout'); window.scrollTo(0, 0); }} className="h-13 w-full rounded-full bg-[#eb1700] text-base font-black hover:bg-[#c61400]">Continue to checkout</Button></div></> : <div className="grid flex-1 place-items-center p-8 text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#f4f4f4]"><ShoppingCart className="size-7" /></span><h3 className="mt-5 text-xl font-black">Your cart is empty</h3><p className="mt-2 text-sm text-[#666]">Add something delicious to get started.</p></div></div>}</aside></>}

      {deliveredToast && <div role="status" aria-live="assertive" className="fixed left-1/2 top-24 z-[70] flex w-[calc(100%-32px)] max-w-md -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#191919] p-4 text-white shadow-2xl"><span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#eb1700]"><Check className="size-5" /></span><div><p className="font-black">Your DashLess has been delivered.</p><p className="text-sm text-white/70">Your savings are ready.</p></div></div>}
    </main>
  );
}
