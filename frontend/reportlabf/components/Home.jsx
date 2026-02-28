import { Menu as Hero } from './menu.jsx';
import { About } from './About.jsx';
import { Contact } from './Contact.jsx';
import { WhatsAppButton } from './WhatsAppButton.jsx';

export function Home() {
    return (
        <main className="animate-fade-in transition-colors">
            <Hero />
            <About />
            <Contact />
            <WhatsAppButton />
        </main>
    );
}
