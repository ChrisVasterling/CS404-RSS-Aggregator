import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Divider, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import API from '../services/electronApiService'
import { type Output, type Item } from 'rss-parser'
import { ExpandMore } from '@mui/icons-material'
import RssItemKeyValues from './RssItemKeyValues'

export default function AddFeedDialog (props: any): JSX.Element {
  const { onClose, open, onAddFeed } = props

  const urlField = useRef<HTMLInputElement>()
  const [feedUrl, setFeedUrl] = useState('')
  const [feedData, setFeedData] = useState<Output<Item> | null>(null)
  const [feedError, setFeedError] = useState('')
  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number>(-1)

  const getFeed = async (purpose: string): Promise<void> => {
    // get the preview of a feed
    if (feedUrl !== null && feedUrl !== '') {
      let url = feedUrl
      if (feedUrl.indexOf('http') !== 0) {
        url = 'https://' + feedUrl
        setFeedUrl(url)
      }
      const response = await API.rssParseUrl(url)
      console.log(response)
      if (response.error !== null && response.error !== undefined) {
        setFeedError('Could not retrieve: "' + url + '"')
      } else {
        if (purpose === 'preview') {
          setFeedData(response)
        } else if (purpose === 'add') {
          if (onAddFeed(url, response) === true) {
            setFeedError('Feed Already Exists')
          }
        }
      }
    }
  }

  const handleCloseAfterTransition = (): void => {
    // reset the state when the dialog is closed
    setFeedUrl('')
    setFeedError('')
    setFeedData(null)
  }

  const getFeedImage = (): string => {
    // check the various places for a feed image
    return feedData?.itunes?.image ?? ''
  }

  useEffect(() => {
    setFeedError('')
  }, [feedData, feedUrl])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionProps={{
        onExited: handleCloseAfterTransition
      }}
      fullWidth={true}
      maxWidth={'md'}
    >
      <DialogTitle>Add an RSS Feed</DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ display: 'flex', flexShrink: 1 }}>
          <TextField
            fullWidth
            label="Feed URL"
            variant="standard"
            value={feedUrl}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFeedUrl(event.target.value)
            }}
            onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter' || event.keyCode === 13) {
                void getFeed('preview')
              }
            }}
            autoFocus
            inputProps={{
              ref: urlField
            }}
            error={feedError !== ''}
            helperText={feedError !== '' ? feedError : null}
            placeholder="http(s)://"
          />
          <Button
            variant="text"
            onClick={() => {
              setFeedUrl('')
              setFeedData(null)
              if (urlField.current !== undefined) {
                urlField.current.focus()
              }
            }}
          >
          Clear
          </Button>
        </Box>
        {feedData !== null && (
          <>
            <Box sx={{ my: 1, display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
              {getFeedImage() !== '' &&
                <img src={getFeedImage()} style={{ maxHeight: '10em' }}/>
              }
              <Box sx={{ display: 'flex', flexDirection: 'column', px: 1 }}>
                <Typography sx={{ fontSize: '2em' }}>
                  {feedData.title}
                </Typography>
                <Typography>
                  {feedData.description}
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              {feedData.items.map((feedItem, index) => {
                return (
                  <Accordion
                    expanded={activeAccordionIndex === index}
                    onChange={() => {
                      setActiveAccordionIndex(index === activeAccordionIndex ? -1 : index)
                    }}
                    key={index}
                    TransitionProps={{ unmountOnExit: true }}
                    disableGutters
                    square
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                    >
                      {feedItem.title}
                    </AccordionSummary>
                    <AccordionDetails>
                      <RssItemKeyValues obj={feedItem} truncateLength={300}/>
                    </AccordionDetails>
                  </Accordion>
                )
              })}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={() => { void getFeed('preview') }}>Preview</Button>
        <Button variant="text" onClick={() => { void getFeed('add') }}>Add</Button>
        <Button variant="text" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
