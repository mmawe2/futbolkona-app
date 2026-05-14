export default function PlayerProfilePage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#111',
        color: 'white',
        padding: '40px',
      }}
    >
      <h1>FutbolKona Football CV</h1>

      <p>Player Profile ID: {params.id}</p>

      <section
        style={{
          marginTop: '30px',
          padding: '20px',
          border: '1px solid #333',
          borderRadius: '12px',
        }}
      >
        <h2>Player Details</h2>
        <p>Name: Coming soon</p>
        <p>Position: Coming soon</p>
        <p>Team / School / Academy: Coming soon</p>
        <p>Verification Status: Pending</p>
      </section>

      <section
        style={{
          marginTop: '30px',
          padding: '20px',
          border: '1px solid #333',
          borderRadius: '12px',
        }}
      >
        <h2>Football Proof</h2>
        <p>Videos and match evidence will appear here.</p>
      </section>
    </main>
  )
}
