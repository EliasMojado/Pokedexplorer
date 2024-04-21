import Header from './components/header';
import Navigation from './components/navigation';
import List from './components/list';
import Content from './components/content';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      <div>
        <Header/>
        <Content/>
      </div>
    </main>
  );
}
