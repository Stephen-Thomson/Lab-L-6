import React, { useState } from 'react'
import { Container, Typography, Grid } from '@mui/material'
import useAsyncEffect from 'use-async-effect'

const App: React.FC = () => {
  // const [identity, setIdentity] = useState<Identity | null>(null)

  useAsyncEffect(async () => {
    // TODO: Use discoverByIdentityKey to resolve identity information.
  }, [])

  return (
    <Container maxWidth="sm" sx={{ paddingTop: '2em' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5">Resolved Identity Information</Typography>
        </Grid>
        {/* TODO: Display identity information here */}
        {/* TODO: Implement search functionality */}
        <Grid item xs={12}>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App