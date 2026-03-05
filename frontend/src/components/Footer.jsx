function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-800 bg-[#020617]">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">

        <div>
          © {new Date().getFullYear()} CodeNexus. All rights reserved.
        </div>

        <div>
          Queries: 
          <a
            href="mailto:abrolpiyush05@gmail.com"
            className="ml-1 text-emerald-400 hover:underline"
          >
            abrolpiyush05@gmail.com
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;