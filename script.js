// =================================================================
// DUMMY DATA, CONSTANTS & CONTEXT
// =================================================================
const initialProducts = [
    { id: 1, name: "boAt Lunar Discovery w/ 1.39\" (3.5 cm)", category: "Wearables", price: 99.99, salePrice: 79.99, description: "boAt Lunar Discovery w/ 1.39\" (3.5 cm) HD Display, Turn-by-Turn Navigation, DIY Watch Face Studio, Bluetooth Calling, Emergency SOS, QR Tray, Smart Watch for Men & Women(Active Black)", images: ["https://i.ibb.co/6y4nNTc/watch-main.png", "https://i.ibb.co/hLq0g24/watch-thumb1.png", "https://i.ibb.co/v43Vq9d/watch-thumb2.png"], featured: true, reviews: [ {id: 1, author: "Alex R.", rating: 5, comment: "Amazing quality and fast shipping!", date: "2023-04-10T10:00:00Z"}, {id: 2, author: "Samantha B.", rating: 4, comment: "The display is crisp and bright. The turn-by-turn navigation is a game-changer for my morning runs.", date: "2023-05-20T14:30:00Z"}, {id: 3, author: "Mark C.", rating: 5, comment: "Finally, a smartwatch with a battery that lasts! Highly recommend.", date: "2023-06-01T08:00:00Z"} ] }, 
    { id: 2, name: "Wireless ANC Headphones", category: "Electronics", price: 199.99, salePrice: null, description: "Immersive sound with active noise cancellation. These headphones provide a premium listening experience with plush earcups for all-day comfort.", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80", "https://images.unsplash.com/photo-1546435770-a3e426bf4022?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"], featured: true, reviews: [ {id: 4, author: "Julia K.", rating: 5, comment: "The noise cancellation is insane. It completely blocks out my noisy office. The sound quality is top-notch too.", date: "2023-07-15T11:00:00Z"}, {id: 5, author: "David L.", rating: 4, comment: "Great sound, but they can get a little uncomfortable after a few hours. Still, for the price, it's a solid pair of headphones.", date: "2023-08-01T18:45:00Z"}, {id: 6, author: "Chris P.", rating: 5, comment: "I've tried headphones twice the price that don't sound this good. The bass is deep without being muddy. A must-buy for audiophiles on a budget.", date: "2023-08-05T12:20:00Z"} ] }, 
    { id: 3, name: "Canvas Backpack", category: "Accessories", price: 89.99, salePrice: 69.99, description: "A rugged and spacious backpack for any adventure. Made from durable, water-resistant canvas with genuine leather accents and multiple compartments.", images: ["https://images.unsplash.com/photo-1553062407-98eeb68c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80"], featured: true, reviews: [ {id: 7, author: "Emily W.", rating: 5, comment: "This backpack has been through hiking trips and daily commutes and still looks brand new. Incredibly durable and stylish.", date: "2023-09-10T09:15:00Z"}, {id: 8, author: "Brian G.", rating: 4, comment: "Lots of space and pockets for organization. My only wish is that the laptop sleeve was a bit more padded. Otherwise, it's perfect.", date: "2023-10-02T16:00:00Z"} ] }
];
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password123";
const CURRENCIES = { USD: "United States Dollar", EUR: "Euro", JPY: "Japanese Yen", GBP: "British Pound Sterling", INR: "Indian Rupee", AUD: "Australian Dollar", CAD: "Canadian Dollar", CHF: "Swiss Franc", CNH: "Chinese Yuan", HKD: "Hong Kong Dollar", NZD: "New Zealand Dollar" };

const AppContext = React.createContext();

// =================================================================
// MAIN APP COMPONENT
// =================================================================
function App() {
    const [page, setPage] = React.useState('home');
    const [selectedProduct, setSelectedProduct] = React.useState(null);
    const [cart, setCart] = React.useState([]);
    const [pageVisible, setPageVisible] = React.useState(true);
    const [confirmationMessage, setConfirmationMessage] = React.useState(null);
    const [isAdmin, setIsAdmin] = React.useState(() => sessionStorage.getItem('isAdminLoggedIn') === 'true');
    const [products, setProducts] = React.useState(() => { try { const s = localStorage.getItem('ecom-products-v12'); return s ? JSON.parse(s) : initialProducts; } catch { return initialProducts; } });
    
    const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'light');
    const [currency, setCurrency] = React.useState(() => localStorage.getItem('currency') || 'USD');
    const [rates, setRates] = React.useState(null);

    React.useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    React.useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('https://api.frankfurter.app/latest?from=USD');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setRates({ ...data.rates, USD: 1 });
            } catch (error) {
                console.error("Failed to fetch currency rates, using USD as default:", error);
                setRates({ USD: 1 });
            }
        };
        fetchRates();
    }, []);

    React.useEffect(() => { localStorage.setItem('currency', currency); }, [currency]);
    React.useEffect(() => { try { localStorage.setItem('ecom-products-v12', JSON.stringify(products)); } catch (e) { console.error("Could not save products", e); } }, [products]);
    React.useEffect(() => { setPageVisible(false); const t = setTimeout(() => setPageVisible(true), 100); return () => clearTimeout(t); }, [page]);
    React.useEffect(() => { if (confirmationMessage) { const t = setTimeout(() => setConfirmationMessage(null), 4000); return () => clearTimeout(t); } }, [confirmationMessage]);

    const navigateTo = (p, d = null) => { window.scrollTo(0, 0); if (d) setSelectedProduct(d); if (p === 'admin' && !isAdmin) { setPage('login'); } else { setPage(p); } };
    const handleLogin = (u, p) => { if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) { setIsAdmin(true); sessionStorage.setItem('isAdminLoggedIn', 'true'); navigateTo('admin'); setConfirmationMessage("Login successful!"); return true; } return false; };
    const handleLogout = () => { setIsAdmin(false); sessionStorage.removeItem('isAdminLoggedIn'); navigateTo('home'); setConfirmationMessage("You have been logged out."); };
    const addToCart = (p) => { setCart(c => { const e = c.find(i => i.id === p.id); if (e) { return c.map(i => i.id === p.id ? { ...i, quantity: i.quantity + 1 } : i); } return [...c, { ...p, quantity: 1 }]; }); setConfirmationMessage(`${p.name} added to cart!`); };
    const updateCartQuantity = (id, nq) => { if (nq <= 0) { removeFromCart(id); } else { setCart(pc => pc.map(i => i.id === id ? { ...i, quantity: nq } : i)); } };
    const removeFromCart = (id) => setCart(pc => pc.filter(i => i.id !== id));
    
    const formatPrice = (priceInUsd) => {
        if (!rates || !rates[currency] || typeof priceInUsd !== 'number') {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceInUsd || 0);
        }
        const convertedPrice = priceInUsd * rates[currency];
        return new Intl.NumberFormat(undefined, { style: 'currency', currency: currency, minimumFractionDigits: 2 }).format(convertedPrice);
    };

    const getCartTotal = () => {
        const totalInUsd = cart.reduce((t, i) => t + (i.salePrice || i.price) * i.quantity, 0);
        return formatPrice(totalInUsd);
    };

    const handleAddProduct = (p) => { setProducts(prev => [...prev, { ...p, id: Date.now(), reviews: [] }]); setConfirmationMessage("Product added!"); };
    const handleUpdateProduct = (p) => { setProducts(prev => prev.map(i => i.id === p.id ? p : i)); setConfirmationMessage("Product updated!"); };
    const handleDeleteProduct = (id) => { setProducts(prev => prev.filter(p => p.id !== id)); setConfirmationMessage("Product deleted!"); };

    const handleAddReview = (productId, review) => {
        const newReview = { ...review, id: Date.now(), date: new Date().toISOString() };
        const updatedProducts = products.map(p => {
            if (p.id === productId) {
                return { ...p, reviews: [newReview, ...p.reviews] };
            }
            return p;
        });
        setProducts(updatedProducts);
        setConfirmationMessage("Thank you for your review!");
    };

    const handleDeleteReview = (productId, reviewId) => {
        const updatedProducts = products.map(p => {
            if (p.id === productId) {
                const updatedReviews = p.reviews.filter(r => r.id !== reviewId);
                return { ...p, reviews: updatedReviews };
            }
            return p;
        });
        setProducts(updatedProducts);
        setConfirmationMessage("Review deleted.");
    };

    const handleResetData = () => { if (window.confirm("Are you sure? This will delete all custom products and restore the original data.")) { localStorage.removeItem('ecom-products-v12'); setProducts(initialProducts); setConfirmationMessage("Data has been reset."); } };

    const renderPage = () => {
        if (!rates) {
            return <div className="min-h-screen flex items-center justify-center text-xl font-semibold dark:text-slate-300">Loading Store...</div>;
        }
        switch (page) {
            case 'home': return <HomePage products={products} navigateTo={navigateTo} addToCart={addToCart} />;
            case 'products': return <ProductListPage products={products} navigateTo={navigateTo} addToCart={addToCart} />;
            case 'productDetail': return <ProductDetailPage product={selectedProduct} navigateTo={navigateTo} addToCart={addToCart} onAddReview={handleAddReview} />;
            case 'cart': return <CartPage cart={cart} updateCartQuantity={updateCartQuantity} removeFromCart={removeFromCart} getCartTotal={getCartTotal} navigateTo={navigateTo} />;
            case 'checkout': return <CheckoutPage cart={cart} getCartTotal={getCartTotal} navigateTo={navigateTo} clearCart={() => setCart([])} />;
            case 'contact': return <ContactPage />;
            case 'login': return <LoginPage onLogin={handleLogin} />;
            case 'admin': return <AdminPage products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} onDeleteReview={handleDeleteReview} onLogout={handleLogout} onResetData={handleResetData} />;
            default: return <HomePage products={products} navigateTo={navigateTo} addToCart={addToCart} />;
        }
    };
    
    const contextValue = { theme, setTheme, currency, setCurrency, rates, formatPrice };

    return (
        <AppContext.Provider value={contextValue}>
            <div className="flex flex-col min-h-screen">
                {page !== 'login' && <Header navigateTo={navigateTo} cartItemCount={cart.reduce((s, i) => s + i.quantity, 0)} />}
                {confirmationMessage && <ConfirmationToast message={confirmationMessage} />}
                <main className={`page-content flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 ${pageVisible ? 'opacity-100' : 'opacity-0'}`}>
                    {renderPage()}
                </main>
                {page !== 'login' && <Footer navigateTo={navigateTo} />}
            </div>
        </AppContext.Provider>
    );
}

// =================================================================
// Reusable Components
// =================================================================
function ConfirmationToast({ message }) { return (<div className="fixed top-24 right-5 z-[100] bg-green-500/90 dark:bg-green-600/90 backdrop-blur-sm text-white py-3 px-6 rounded-lg shadow-2xl toast-animation"><p className="font-semibold">{message}</p></div>); }

function ProductCard({ product, navigateTo, addToCart }) {
    const { formatPrice } = React.useContext(AppContext);
    const displayImage = product.images && product.images.length > 0 ? product.images[0] : "https://via.placeholder.com/600x400.png?text=No+Image";
    const onSale = product.salePrice && product.salePrice < product.price;
    const displayPrice = onSale ? product.salePrice : product.price;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl dark:hover:shadow-indigo-500/10 hover:-translate-y-2 group">
            <div className="cursor-pointer relative" onClick={() => navigateTo('productDetail', product)}>
                <div className="h-56 bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    <img src={displayImage} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="p-5">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">{product.category}</p>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{product.name}</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                        <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{formatPrice(displayPrice)}</p>
                        {onSale && <p className="text-lg line-through text-slate-500 dark:text-slate-400">{formatPrice(product.price)}</p>}
                    </div>
                </div>
            </div>
            <div className="px-5 pb-5">
                <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-500 transition-all duration-300 transform hover:-translate-y-px">Add to Cart</button>
            </div>
        </div>
    );
}

function StripePlaceholderForm() { return (<div className="mt-8"><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Payment Details</h3><div className="space-y-4"><div><label htmlFor="card-name" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Name on Card</label><input type="text" id="card-name" placeholder="John M. Doe" className="mt-1 block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" /></div><div><label htmlFor="card-element" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Card Information</label><div id="card-element" className="mt-1 block w-full border border-slate-300 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-700"><div className="flex justify-between items-center"><span className="text-slate-500 dark:text-slate-400">**** **** **** 4242</span><span className="text-slate-500 dark:text-slate-400">12/25</span><span className="text-slate-500 dark:text-slate-400">CVC</span></div></div></div><p className="text-xs text-slate-500 dark:text-slate-400 pt-2 flex items-center"><svg className="w-4 h-4 inline mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg> Demo Only. This is not a real payment form.</p></div></div>); }

function ImageMagnifier({ src, alt, zoomLevel = 2.5, lensSize = 120 }) {
    const [showMagnifier, setShowMagnifier] = React.useState(false);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const containerRef = React.useRef(null);
    const imageRef = React.useRef(null);

    const handleMouseMove = (e) => {
        if (!containerRef.current || !imageRef.current) return;
        const { left: containerLeft, top: containerTop } = containerRef.current.getBoundingClientRect();
        const { width: imageWidth, height: imageHeight } = imageRef.current.getBoundingClientRect();
        let x = e.pageX - containerLeft - window.scrollX;
        let y = e.pageY - containerTop - window.scrollY;
        if (x > imageWidth - lensSize / 2) { x = imageWidth - lensSize / 2; }
        if (x < lensSize / 2) { x = lensSize / 2; }
        if (y > imageHeight - lensSize / 2) { y = imageHeight - lensSize / 2; }
        if (y < lensSize / 2) { y = lensSize / 2; }
        setPosition({ x, y });
    };
    const backgroundX = -((position.x - lensSize / 2) * zoomLevel);
    const backgroundY = -((position.y - lensSize / 2) * zoomLevel);
    const backgroundSize = imageRef.current ? `${imageRef.current.width * zoomLevel}px ${imageRef.current.height * zoomLevel}px` : 'auto';

    return (
        <div className="relative">
            <div ref={containerRef} className="h-96 lg:h-[450px] bg-slate-200 dark:bg-slate-700/50 rounded-2xl shadow-inner flex items-center justify-center cursor-crosshair overflow-hidden" onMouseEnter={() => setShowMagnifier(true)} onMouseLeave={() => setShowMagnifier(false)} onMouseMove={handleMouseMove}>
                <img ref={imageRef} src={src} alt={alt} className="max-w-full max-h-full object-contain" />
                <div style={{ display: showMagnifier ? 'block' : 'none', position: 'absolute', left: `${position.x - lensSize / 2}px`, top: `${position.y - lensSize / 2}px`, width: `${lensSize}px`, height: `${lensSize}px`, border: '3px solid #4f46e5', pointerEvents: 'none', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }} />
            </div>
            <div style={{ display: showMagnifier ? 'block' : 'none', position: 'absolute', top: 0, left: '105%', width: '100%', height: '100%', backgroundImage: `url(${src})`, backgroundPosition: `${backgroundX}px ${backgroundY}px`, backgroundSize: backgroundSize, backgroundRepeat: 'no-repeat', border: '1px solid #e2e8f0', zIndex: 10, backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)' }} className="hidden xl:block dark:border-slate-700 dark:bg-slate-800" />
        </div>
    );
}

function ThemeSwitcher() {
    const { theme, setTheme } = React.useContext(AppContext);
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
    return (
        <button onClick={toggleTheme} className="text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-full transition-colors">
            {theme === 'light' ? (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
            )}
        </button>
    );
}

function CurrencySwitcher() {
    const { currency, setCurrency } = React.useContext(AppContext);
    return (
        <div className="relative">
            <select value={currency} onChange={e => setCurrency(e.target.value)} className="appearance-none w-full bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-semibold rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors">
                {Object.keys(CURRENCIES).map(code => (
                    <option key={code} value={code} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold">{code}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 dark:text-slate-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
            </div>
        </div>
    );
}

function StarRating({ rating, setRating, interactive = false }) {
    return (
        <div className={`flex ${interactive ? 'cursor-pointer' : ''}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    onClick={() => interactive && setRating(star)}
                    className={`w-6 h-6 ${rating >= star ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-500'} ${interactive ? 'hover:text-yellow-400' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function FadeInSection({ children }) {
    const [isVisible, setVisible] = React.useState(false);
    const domRef = React.useRef();

    React.useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(domRef.current);
                }
            });
        }, { threshold: 0.1 });

        const currentRef = domRef.current;
        if(currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if(currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <div className={`fade-in-section ${isVisible ? 'is-visible' : ''}`} ref={domRef}>
            {children}
        </div>
    );
}

function TypingHeadline({ text, speed = 80 }) {
    const [displayedText, setDisplayedText] = React.useState('');
    const [isTyping, setIsTyping] = React.useState(true);

    React.useEffect(() => {
        setIsTyping(true);
        setDisplayedText('');
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);
            }
        }, speed);

        return () => clearInterval(typingInterval);
    }, [text, speed]);

    return (
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
            {displayedText}
            {isTyping && <span className="typing-cursor"></span>}
        </h1>
    );
}

function Particles({ count = 25 }) {
    const particles = React.useMemo(() => {
        const particleArray = [];
        for (let i = 0; i < count; i++) {
            const size = Math.random() * 15 + 5;
            const style = {
                left: `${Math.random() * 100}%`,
                width: `${size}px`,
                height: `${size}px`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${Math.random() * 15 + 10}s`,
            };
            particleArray.push(<div key={i} className="particle" style={style}></div>);
        }
        return particleArray;
    }, [count]);
    
    const isMobile = window.innerWidth < 768;

    return (
        <div className="particles-container">
            {isMobile ? particles.slice(0, Math.floor(count / 2)) : particles}
        </div>
    );
}

// =================================================================
// Page Components
// =================================================================
function Header({ navigateTo, cartItemCount }) { 
    const [isMenuOpen, setIsMenuOpen] = React.useState(false); 
    const NavLink = ({ page, children }) => ( <a href="#" onClick={(e) => { e.preventDefault(); navigateTo(page); setIsMenuOpen(false); }} className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm font-semibold transition-colors">{children}</a> ); 
    return ( <nav className="glass-header sticky top-0 z-50"> <div className="container mx-auto px-4 sm:px-6 lg:px-8"> <div className="flex items-center justify-between h-20"> <div className="flex items-center"> <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="text-slate-800 dark:text-slate-100 text-2xl font-bold flex items-center"> <svg className="h-8 w-8 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> Starlight </a> </div> <div className="hidden md:block"> <div className="ml-10 flex items-baseline space-x-4"> <NavLink page="home">Home</NavLink> <NavLink page="products">Products</NavLink> <NavLink page="contact">Contact</NavLink> </div> </div> <div className="flex items-center gap-4"> <CurrencySwitcher /> <ThemeSwitcher /> <button onClick={() => navigateTo('cart')} className="relative text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-full transition-colors"> <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg> {cartItemCount > 0 && (<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">{cartItemCount}</span>)} </button> <div className="md:hidden ml-2"> <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none p-2 rounded-full"><svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">{isMenuOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />)}</svg></button> </div> </div> </div> </div> {isMenuOpen && (<div className="md:hidden bg-white/80 dark:bg-slate-800/80"><div className="px-2 pt-2 pb-3 space-y-1 sm:px-3"><NavLink page="home">Home</NavLink><NavLink page="products">Products</NavLink><NavLink page="contact">Contact</NavLink></div></div>)} </nav> ); }

function Footer({ navigateTo }) { 
    const FooterLink = ({ page, children }) => (<a href="#" onClick={(e) => { e.preventDefault(); navigateTo(page); }} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">{children}</a>); 
    return (
        <footer className="bg-slate-200 dark:bg-slate-800 text-slate-800">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Shop</h3>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink page="home">Home</FooterLink></li>
                            <li><FooterLink page="products">All Products</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Support</h3>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink page="contact">Contact Us</FooterLink></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Admin</h3>
                        <ul className="mt-4 space-y-2">
                            <li><FooterLink page="admin">Admin Panel</FooterLink></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-300 dark:border-slate-700 pt-8 text-center text-slate-500 dark:text-slate-400 text-sm">&copy; {new Date().getFullYear()} Starlight. All rights reserved. Built with React & Tailwind CSS.</div>
            </div>
        </footer>
    ); 
}

function HomePage({ products, navigateTo, addToCart }) {
    const featuredProducts = products.filter(p => p.featured).slice(0, 3);
    return (
        <div className="space-y-24">
            <FadeInSection>
                <section className="relative text-center pt-24 pb-28 md:pt-32 md:pb-36 rounded-3xl overflow-hidden -mt-8">
                    <div className="animated-gradient"></div>
                    <Particles count={25} />
                    <div className="relative z-10 px-4">
                        <TypingHeadline text="Curated Goods for Modern Living." />
                        <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90">Discover our hand-picked collection of quality products designed to elevate your everyday life.</p>
                        <button onClick={() => navigateTo('products')} className="mt-8 bg-white/90 text-indigo-700 font-bold py-4 px-8 rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-2xl">
                            Explore All Products
                        </button>
                    </div>
                </section>
            </FadeInSection>

            <FadeInSection>
                <section>
                    <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-12">Featured Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{featuredProducts.map(p => (<ProductCard key={p.id} product={p} navigateTo={navigateTo} addToCart={addToCart} />))}</div>
                </section>
            </FadeInSection>
            
            <FadeInSection>
                 <section className="relative bg-cover bg-center bg-fixed rounded-3xl p-8 sm:p-12" style={{backgroundImage: "url('https://images.unsplash.com/photo-1554141542-03610f33e8b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1771&q=80')"}}>
                    <div className="absolute inset-0 bg-slate-900/50 rounded-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold text-center text-white mb-12">What Our Customers Say</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-xl transition-all duration-300 hover:bg-white/20 hover:border-white/40 transform hover:-translate-y-2">
                                <p className="text-white/90 italic">"The quality is exceptional and the shipping was incredibly fast. I'm a customer for life!"</p>
                                <p className="mt-6 font-bold text-right text-white">- Alex R.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-xl transition-all duration-300 hover:bg-white/20 hover:border-white/40 transform hover:-translate-y-2">
                                <p className="text-white/90 italic">"I absolutely love my new headphones. The sound is crystal clear and they are so comfortable."</p>
                                <p className="mt-6 font-bold text-right text-white">- Sarah J.</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-xl transition-all duration-300 hover:bg-white/20 hover:border-white/40 transform hover:-translate-y-2">
                                <p className="text-white/90 italic">"Five stars for customer service! They were so helpful and responsive to my questions."</p>
                                <p className="mt-6 font-bold text-right text-white">- Michael B.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </FadeInSection>

            <FadeInSection>
                <section className="text-center bg-indigo-600 text-white rounded-2xl py-16 px-8">
                    <h2 className="text-4xl font-bold">Join Our Newsletter</h2>
                    <p className="mt-4 max-w-xl mx-auto">Get the latest updates on new products and upcoming sales.</p>
                    <div className="mt-8 max-w-md mx-auto flex">
                        <input type="email" placeholder="Enter your email" className="w-full rounded-l-lg p-4 text-slate-800 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
                        <button className="bg-slate-800 text-white font-bold p-4 rounded-r-lg hover:bg-slate-900">Subscribe</button>
                    </div>
                </section>
            </FadeInSection>
        </div>
    );
}

function ProductListPage({ products, navigateTo, addToCart }) {
    const { formatPrice } = React.useContext(AppContext);
    const [filteredProducts, setFilteredProducts] = React.useState(products); 
    const [categoryFilter, setCategoryFilter] = React.useState('all'); 
    const [priceFilter, setPriceFilter] = React.useState(1000); 
    const categories = ['all', ...new Set(products.map(p => p.category))]; 
    React.useEffect(() => { 
        let tempProducts = products.filter(p => (categoryFilter === 'all' || p.category === categoryFilter) && p.price <= priceFilter); 
        setFilteredProducts(tempProducts); 
    }, [categoryFilter, priceFilter, products]); 
    return (<div><h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-12 text-center">All Products</h1><div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mb-12 flex flex-col md:flex-row gap-6 items-center justify-center"><div className="flex items-center space-x-3"><label htmlFor="category" className="font-semibold text-slate-600 dark:text-slate-300">Category:</label><select id="category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">{categories.map(cat => <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>)}</select></div><div className="flex items-center space-x-3 w-full md:w-80"><label htmlFor="price" className="font-semibold text-slate-600 dark:text-slate-300">Max Price:</label><input type="range" id="price" min="0" max="1000" value={priceFilter} onChange={(e) => setPriceFilter(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-indigo-600"/><span className="font-bold text-indigo-600 dark:text-indigo-400 w-28 text-right">{formatPrice(priceFilter)}</span></div></div>{filteredProducts.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">{filteredProducts.map(product => (<ProductCard key={product.id} product={product} navigateTo={navigateTo} addToCart={addToCart} />))}</div>) : (<div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-lg"><h2 className="text-3xl font-semibold text-slate-700 dark:text-slate-200">No products match your filters.</h2><p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting the category or price range.</p></div>)}</div>);
}
function ProductDetailPage({ product, navigateTo, addToCart, onAddReview }) {
    const { formatPrice } = React.useContext(AppContext);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
    if (!product) {
        return <div>Product not found. <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('products'); }} className="text-indigo-600 hover:underline">Back to products</a>.</div>;
    }
    const onSale = product.salePrice && product.salePrice < product.price;
    const displayPrice = onSale ? product.salePrice : product.price;

    return (
        <div>
            <button onClick={() => navigateTo('products')} className="mb-8 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors">&larr; Back to All Products</button>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden mb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-4 sm:p-6">
                        <ImageMagnifier key={product.images[selectedImageIndex]} src={product.images[selectedImageIndex]} alt={`${product.name} view ${selectedImageIndex + 1}`} />
                        {product.images.length > 1 && (
                            <div className="flex justify-center gap-4 mt-4">
                                {product.images.map((img, index) => (
                                    <button key={index} onClick={() => setSelectedImageIndex(index)} className={`w-20 h-20 rounded-xl overflow-hidden ring-2 ring-offset-2 dark:ring-offset-slate-800 transition-all ${index === selectedImageIndex ? 'ring-indigo-500' : 'ring-transparent hover:ring-indigo-300'}`}>
                                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover"/>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="p-8 sm:p-12 flex flex-col justify-center">
                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{product.category}</p>
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white my-3">{product.name}</h1>
                        <div className="flex items-baseline gap-4 my-4">
                            <p className="text-4xl font-bold text-slate-800 dark:text-slate-100">{formatPrice(displayPrice)}</p>
                            {onSale && <p className="text-2xl line-through text-slate-500 dark:text-slate-400">{formatPrice(product.price)}</p>}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 mb-8">{product.description}</p>
                        <button onClick={() => addToCart(product)} className="mt-6 bg-indigo-600 text-white font-bold py-4 px-10 rounded-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto">Add to Cart</button>
                    </div>
                </div>
            </div>
            <ReviewSection product={product} onAddReview={onAddReview} />
        </div>
    );
}
function ReviewSection({ product, onAddReview }) {
    const [author, setAuthor] = React.useState('');
    const [rating, setRating] = React.useState(5);
    const [comment, setComment] = React.useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!author.trim() || !comment.trim()) {
            alert("Please fill in your name and comment.");
            return;
        }
        onAddReview(product.id, { author, rating, comment });
        setAuthor('');
        setRating(5);
        setComment('');
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">Leave a Review</h3>
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="author" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Your Name</label>
                            <input type="text" id="author" value={author} onChange={e => setAuthor(e.target.value)} className="mt-1 block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Your Rating</label>
                            <StarRating rating={rating} setRating={setRating} interactive={true} />
                        </div>
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Your Comment</label>
                            <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows="4" className="mt-1 block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required></textarea>
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all">Submit Review</button>
                    </form>
                </div>
                <div className="space-y-8 max-h-96 overflow-y-auto pr-4">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map(review => (
                            <div key={review.id} className="border-b border-slate-200 dark:border-slate-700 pb-6">
                                <StarRating rating={review.rating} />
                                <p className="text-slate-600 dark:text-slate-300 my-2">{review.comment}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">&mdash; {review.author} on {new Date(review.date).toLocaleDateString()}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-slate-500 dark:text-slate-400">This product has no reviews yet. Be the first!</p>
                    )}
                </div>
            </div>
        </div>
    )
}
function CartPage({ cart, updateCartQuantity, removeFromCart, getCartTotal, navigateTo }) { 
    const { formatPrice } = React.useContext(AppContext);
    return (<div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl"><h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">Your Shopping Cart</h1>{cart.length === 0 ? (<div className="text-center py-16"><p className="text-2xl text-slate-600 dark:text-slate-300">Your cart is empty.</p><button onClick={() => navigateTo('products')} className="mt-6 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all">Continue Shopping</button></div>) : (<div><div className="space-y-6">{cart.map(item => (<div key={item.id} className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-6"><div className="flex items-center mb-4 sm:mb-0 w-full sm:w-1/2"><img src={item.images[0]} alt={item.name} className="w-24 h-24 object-cover rounded-xl mr-6"/><div><h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{item.name}</h2><p className="text-slate-500 dark:text-slate-400">{formatPrice(item.salePrice || item.price)}</p><button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-sm mt-1 font-semibold">Remove</button></div></div><div className="flex items-center gap-4"><div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg"><button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l-lg">-</button><span className="px-4 font-bold">{item.quantity}</span><button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r-lg">+</button></div><p className="font-bold w-32 text-right text-lg">{formatPrice((item.salePrice || item.price) * item.quantity)}</p></div></div>))}</div><div className="mt-8 flex flex-col md:flex-row justify-between items-center"><div className="text-3xl font-bold">Total: <span className="text-indigo-600 dark:text-indigo-400">{getCartTotal()}</span></div><button onClick={() => navigateTo('checkout')} className="mt-6 md:mt-0 w-full md:w-auto bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg">Proceed to Checkout</button></div></div>)}</div>);
}
function CheckoutPage({ cart, getCartTotal, navigateTo, clearCart }) { 
    const { formatPrice } = React.useContext(AppContext);
    const [isProcessing, setIsProcessing] = React.useState(false); 
    
    const handlePlaceOrder = (e) => { 
        e.preventDefault(); 
        setIsProcessing(true); 
        setTimeout(() => { 
            alert('Payment successful! Thank you for your order.'); 
            clearCart(); 
            navigateTo('home'); 
        }, 2500); 
    }; 

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-12 text-center">Checkout</h1>
            <form onSubmit={handlePlaceOrder}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl order-2 lg:order-1">
                        <h2 className="text-2xl font-semibold mb-6">Shipping & Payment</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">Shipping Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Full Name</label>
                                        <input type="text" id="name" className="mt-1 block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Address</label>
                                        <input type="text" id="address" className="mt-1 block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required />
                                    </div>
                                </div>
                            </div>
                            <StripePlaceholderForm />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl h-fit order-1 lg:order-2">
                        <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between text-slate-700 dark:text-slate-300">
                                    <span className="truncate pr-4">{item.name} <span className="text-slate-500 dark:text-slate-400">x {item.quantity}</span></span>
                                    <span className="font-semibold">{formatPrice((item.salePrice || item.price) * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-6 space-y-2">
                            <div className="flex justify-between font-bold text-xl">
                                <span>Total</span>
                                <span className="text-indigo-600 dark:text-indigo-400">{getCartTotal()}</span>
                            </div>
                        </div>
                        <button type="submit" disabled={isProcessing} className="mt-8 w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-slate-400 transition-all transform hover:scale-105 shadow-lg">
                            {isProcessing ? 'Processing...' : `Pay ${getCartTotal()}`}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

function ContactPage() { const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = Object.fromEntries(formData.entries()); console.log("Form submitted:", data); alert(`Thank you for your message, ${data.name}! We'll get back to you soon.`); e.target.reset(); }; return (<div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl"><h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 text-center">Contact Us</h1><p className="text-center text-slate-600 dark:text-slate-300 mb-10">Have a question or feedback? Fill out the form below.</p><form onSubmit={handleSubmit} className="space-y-6"><div><label htmlFor="name" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Name</label><input type="text" name="name" id="name" required className="mt-1 block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" /></div><div><label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Email</label><input type="email" name="email" id="email" required className="mt-1 block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" /></div><div><label htmlFor="message" className="block text-sm font-medium text-slate-600 dark:text-slate-400">Message</label><textarea name="message" id="message" rows="5" required className="mt-1 block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"></textarea></div><div><button type="submit" className="w-full flex justify-center py-3 px-4 border-transparent rounded-lg shadow-md text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105">Send Message</button></div></form></div>); }
function LoginPage({ onLogin }) { const [username, setUsername] = React.useState(''); const [password, setPassword] = React.useState(''); const [error, setError] = React.useState(''); const handleSubmit = (e) => { e.preventDefault(); setError(''); const success = onLogin(username, password); if (!success) { setError('Invalid username or password.'); } }; return ( <div className="flex items-center justify-center min-h-[70vh]"> <div className="w-full max-w-md bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl"> <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 text-center">Admin Login</h1> <form onSubmit={handleSubmit} className="space-y-6"> <div> <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Username</label> <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required /> </div> <div> <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Password</label> <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required /> </div> {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>} <div> <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105">Login</button> </div> </form> </div> </div> ); }

function AdminPage({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onDeleteReview, onLogout, onResetData }) { 
    const [view, setView] = React.useState('table'); 
    const [productToEdit, setProductToEdit] = React.useState(null); 
    const [productToManageReviews, setProductToManageReviews] = React.useState(null); 
    const handleShowForm = (p = null) => { setProductToEdit(p); setView('form'); }; 
    const handleShowTable = () => { setProductToEdit(null); setProductToManageReviews(null); setView('table'); }; 
    const handleShowReviews = (p) => { setProductToManageReviews(p); setView('reviews'); }; 
    const handleSaveProduct = (p) => { if (productToEdit) { onUpdateProduct(p); } else { onAddProduct(p); } handleShowTable(); }; 
    const handleDeleteClick = (id) => { if (window.confirm('Are you sure you want to delete this product?')) { onDeleteProduct(id); } }; 
    return ( 
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl"> 
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"> 
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1> 
                <div className="flex flex-wrap gap-4"> 
                    {view !== 'table' && <button onClick={handleShowTable} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-700 transition-all">&larr; Back to Products</button>} 
                    {view === 'table' && (
                        <>
                            <button onClick={() => handleShowForm()} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all">Add Product</button>
                            <button onClick={onResetData} className="bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-all">Reset Data</button>
                        </>
                    )}
                    <button onClick={onLogout} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-all">Logout</button> 
                </div> 
            </div> 
            {view === 'table' && <ProductTable products={products} onEdit={handleShowForm} onDelete={handleDeleteClick} onManageReviews={handleShowReviews} />} 
            {view === 'form' && <ProductForm product={productToEdit} onSave={handleSaveProduct} onCancel={handleShowTable} />} 
            {view === 'reviews' && <ReviewManager product={productToManageReviews} onDeleteReview={onDeleteReview} />} 
        </div> 
    ); 
}

function ProductTable({ products, onEdit, onDelete, onManageReviews }) { return ( <div className="overflow-x-auto"> <table className="min-w-full bg-white dark:bg-slate-800"> <thead className="bg-slate-100 dark:bg-slate-700"> <tr> <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-slate-600 dark:text-slate-300">Name</th> <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-slate-600 dark:text-slate-300">Category</th> <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-slate-600 dark:text-slate-300">Price</th> <th className="text-left py-3 px-4 uppercase font-semibold text-sm text-slate-600 dark:text-slate-300">Actions</th> </tr> </thead> <tbody className="text-slate-700 dark:text-slate-300"> {products.map(p => ( <tr key={p.id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"> <td className="text-left py-4 px-4 font-semibold">{p.name}</td> <td className="text-left py-4 px-4">{p.category}</td> <td className="text-left py-4 px-4">${p.price.toFixed(2)}{p.salePrice ? <span className="text-red-500"> (On Sale)</span> : ''}</td> <td className="text-left py-4 px-4 whitespace-nowrap"> <button onClick={() => onEdit(p)} className="font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4 transition-colors">Edit</button> <button onClick={() => onManageReviews(p)} className="font-semibold text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mr-4 transition-colors">Reviews ({p.reviews.length})</button> <button onClick={() => onDelete(p.id)} className="font-semibold text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 transition-colors">Delete</button> </td> </tr> ))} </tbody> </table> </div> ); }
function ReviewManager({ product, onDeleteReview }) {
    return (
        <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Manage Reviews for:</h2>
            <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-6">{product.name}</h3>
            <div className="space-y-4">
                {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map(review => (
                        <div key={review.id} className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg flex justify-between items-start">
                            <div>
                                <StarRating rating={review.rating} />
                                <p className="text-slate-600 dark:text-slate-300 my-2">{review.comment}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">&mdash; {review.author} on {new Date(review.date).toLocaleDateString()}</p>
                            </div>
                            <button onClick={() => onDeleteReview(product.id, review.id)} className="bg-red-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-600 transition-all text-sm">Delete</button>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-500 dark:text-slate-400">This product has no reviews to manage.</p>
                )}
            </div>
        </div>
    );
}
function ProductForm({ product, onSave, onCancel }) { const emptyProduct = { name: '', category: 'Electronics', price: 0, salePrice: null, description: '', images: [''], featured: false, reviews: [] }; const [formData, setFormData] = React.useState(product || emptyProduct); React.useEffect(() => { setFormData(product || emptyProduct); }, [product]); const handleChange = (e) => { const { name, value, type, checked } = e.target; let val = value; if (type === 'number') { val = value === '' ? null : parseFloat(value); } if (type === 'checkbox') { val = checked; } setFormData(prev => ({ ...prev, [name]: val })); }; const handleImageChange = (e, index) => { const newImages = [...formData.images]; newImages[index] = e.target.value; setFormData(prev => ({ ...prev, images: newImages })); }; const addImageField = () => { setFormData(prev => ({ ...prev, images: [...(prev.images || []), ''] })); }; const removeImageField = (index) => { if (formData.images.length <= 1) return; setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) })); }; const handleSubmit = (e) => { e.preventDefault(); const finalProductData = { ...formData, images: formData.images ? formData.images.filter(url => url.trim() !== '') : [] }; onSave(finalProductData); }; return ( <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2> <form onSubmit={handleSubmit} className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Name</label><input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required /></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Category</label><select name="category" value={formData.category || 'Electronics'} onChange={handleChange} className="mt-1 block w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"><option>Electronics</option><option>Wearables</option><option>Accessories</option><option>Home Goods</option><option>Food & Drink</option></select></div> </div> <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Price (USD)</label><input type="number" name="price" value={formData.price || ''} onChange={handleChange} step="0.01" className="mt-1 block w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" required /></div><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Sale Price (USD) - Optional</label><input type="number" name="salePrice" value={formData.salePrice || ''} onChange={handleChange} step="0.01" placeholder="Leave empty for no discount" className="mt-1 block w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" /></div></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Description</label><textarea name="description" value={formData.description || ''} onChange={handleChange} rows="4" className="mt-1 block w-full p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"></textarea></div> <div> <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Image URLs</label> {(formData.images || []).map((url, index) => ( <div key={index} className="flex items-center gap-2 mb-2"> <input type="url" value={url} onChange={(e) => handleImageChange(e, index)} placeholder="https://example.com/image.jpg" className="flex-grow p-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition" /> <button type="button" onClick={() => removeImageField(index)} className="bg-red-500 text-white p-2 rounded-lg h-12 w-12 flex items-center justify-center hover:bg-red-600 disabled:bg-slate-300 dark:disabled:bg-slate-600" disabled={!formData.images || formData.images.length <= 1}>&ndash;</button> </div> ))} <button type="button" onClick={addImageField} className="bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-100 py-2 px-4 rounded-lg hover:bg-slate-300 text-sm font-semibold">Add Image</button> </div> <div className="flex items-center"><input type="checkbox" name="featured" checked={formData.featured || false} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 bg-white dark:bg-slate-700 text-indigo-600 focus:ring-indigo-500" /><label className="ml-3 text-sm text-slate-600 dark:text-slate-400">Boost Product on Homepage</label></div> <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700"><button type="button" onClick={onCancel} className="bg-slate-200 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-100 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">Cancel</button><button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">Save Product</button></div> </form> </div> ); }

// =================================================================
// RENDER THE APP
// =================================================================
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
