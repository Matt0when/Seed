
export default function Home() {
  return (
    <>
      <header style={{ padding: '20px', display: 'flex', alignItems: 'center', color: '#1C3A13' }}>
        <span style={{ fontSize: '20px' }}>[logo]</span>
        <nav style={{ display: 'flex', gap: '24px', paddingLeft: '40px' }}>
          <a href="#">Shop</a>
          <a href="#">Science</a>
          <a href="#">Learn</a>
        </nav>
      </header>
      <main>
        <h1>Welcome to Seed</h1>
        <p>Frontend Engineering Takehome</p>
      </main>
    </>
  );
}
