import React, { useState, useEffect } from 'react'
import { Container, Typography, Grid, Autocomplete, TextField } from '@mui/material'
import useAsyncEffect from 'use-async-effect'
import { discoverByIdentityKey, discoverByAttributes } from '@babbage/sdk-ts'
import { parseIdentity, TrustLookupResult, Identity } from 'identinator'
import { Img } from 'uhrp-react' // For displaying images

const App: React.FC = () => {
  const [identity, setIdentity] = useState<Identity | null>(null)  // State to hold the identity information
  const [avatar, setAvatar] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState<string>('') // Search term for identities
  const [nameResults, setNameResults] = useState<Identity[]>([]) // Store full identity results for search

  // Fetch identity by identity key on mount
  useAsyncEffect(async () => {
    try {
      const identityInfo = await discoverByIdentityKey({
        identityKey: '0294c479f762f6baa97fbcd4393564c1d7bd8336ebd15928135bbcf575cd1a71a1',
        description: "Discover Identity Key"
      })

      if (Array.isArray(identityInfo) && identityInfo.length > 0) {
        const id = identityInfo[0] as TrustLookupResult  // Only if it's an array with items
        setIdentity(parseIdentity(id)) // Parse and set identity info
      } else {
        console.log('No identity info found for the provided key')
      }

    } catch (error) {
      console.error('Error discovering identity:', error)
    }
  }, [])

  // Update avatar URL when identity changes
  useEffect(() => {
    setAvatar(identity?.avatarURL)
  }, [identity])

  // Fetch identities dynamically based on search term
  useAsyncEffect(async () => {
    if (searchTerm) {
      try {
        const results = await discoverByAttributes({
          attributes: {
            any: searchTerm,  // Search by any attribute (name, email, username, etc.)
          },
          description: 'Search for identities',
        })
        const lookupResults = results as TrustLookupResult[]

        const searchResults = lookupResults.map(result => parseIdentity(result)) // Parse results
        setNameResults(searchResults) // Store full identity results
      } catch (error) {
        console.error('Error fetching identities:', error)
      }
    }
  }, [searchTerm])

  return (
    <Container maxWidth="sm" sx={{ paddingTop: '2em' }}>
      
        {/* Display Identity Information */}
        <Grid item xs={12}>
          <Typography variant="h5">Resolved Identity Information</Typography>
          {identity ? (
            <div>
              {/* Display the name */}
              {identity.name && (
                <Typography variant="h6">
                  Name: {identity.name}
                </Typography>
              )}

              {/* Display the avatar */}
              {identity.avatarURL && (
                <div style={{ marginTop: '1em', textAlign: 'center' }}>
                  <Img src={identity.avatarURL} alt="Identity Avatar" style={{ width: '100px', borderRadius: '50%' }} />
                </div>
              )}

              {/* Display the abbreviated identity key */}
              {identity.abbreviatedKey && (
                <Typography variant="body1" style={{ marginTop: '1em' }}>
                  Key: {identity.abbreviatedKey}
                </Typography>
              )}

              {/* Display the badge icon and label */}
              {identity.badgeIconURL && identity.badgeLabel && (
                <div style={{ marginTop: '1em', textAlign: 'center' }}>
                  <Img src={identity.badgeIconURL} alt="Badge Icon" style={{ width: '50px' }} />
                  <Typography variant="body2">
                    {identity.badgeLabel} -{' '}
                    {identity.badgeClickURL && (
                      <a href={identity.badgeClickURL} target="_blank" rel="noopener noreferrer">
                        Learn more
                      </a>
                    )}
                  </Typography>
                </div>
              )}
            </div>
          ) : (
            <Typography>No identity information found</Typography>
          )}
        </Grid>

        <Grid container spacing={2}>

          {/* Search Bar */}
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={nameResults.map(result => result.name || '')}
              renderInput={(params) => 
                <TextField
                  {...params}
                  label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              }
            />
          </Grid>
          
      </Grid>
    </Container>
  )
}

export default App
