import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Jalan-Jalan"
                width={36}
                height={36}
                className="size-9 object-contain"
              />
              <span className="font-bold text-lg text-jj-terracotta">Jalan-Jalan</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-md">
              A cognitive travel planning platform that helps individuals and groups 
              make informed, context-aware decisions for their holiday retreats.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/search" className="hover:text-foreground transition-colors">Search Destinations</Link></li>
              <li><Link href="/dashboard/itinerary" className="hover:text-foreground transition-colors">Trip Planning</Link></li>
              <li><Link href="/chat" className="hover:text-foreground transition-colors">AI Assistant</Link></li>
              <li><Link href="/community" className="hover:text-foreground transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Project */}
          <div>
            <h4 className="font-semibold mb-4">Project</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/insights" className="hover:text-foreground transition-colors">Insights</Link></li>
              <li><Link href="/predictions" className="hover:text-foreground transition-colors">Predictions</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>ICT703 - Human Centered Informatics | UiTM</p>
          <p className="mt-1">© 2025 Jalan-Jalan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
