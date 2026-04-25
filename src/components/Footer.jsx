export default function Footer() {
  return (
    <footer className="bg-obsidian-400 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <span className="text-3xl font-display font-bold text-gradient">STEFU</span>
            <p className="mt-4 text-white/60 max-w-md leading-relaxed">
              Welcome to Stefu&apos;s world. Experience exclusive content, live streams, 
              and connect with the legend. Inner Circle membership available.
            </p>
            <div className="flex space-x-4 mt-6">
              {['I', 'T', 'Y'].map((letter, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-gold-500 flex items-center justify-center text-white/50 hover:text-obsidian-400 transition-all duration-300"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Content</h4>
            <ul className="space-y-3 text-white/50">
              {['Live', 'Episodes', 'Moments', 'Podcasts', 'Vlog', 'Music / Radio', 'Shop'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-gold-500 transition-colors inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">More</h4>
            <ul className="space-y-3 text-white/50">
              {['Bio', 'Tips', 'Community', 'Game', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={item === 'Game' ? '#game' : '#'} className="hover:text-gold-500 transition-colors inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <h4 className="text-white font-semibold mb-4 mt-6">Legal</h4>
            <ul className="space-y-3 text-white/50">
              {['Terms of Service', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-gold-500 transition-colors inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2026 stefu.com — All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Made with power in Finland
          </p>
        </div>
      </div>
    </footer>
  )
}