import React, { useRef, useState } from 'react'
import { AppBar, Box, Button, CssBaseline, Stack, Toolbar, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import API from '../services/electronApiService'
import AddFeedDialog from './AddFeedDialog'
import { type Output, type Item } from 'rss-parser'
import FeedList from './FeedList'
import ItemList from './ItemList'
import RssItemKeyValues from './RssItemKeyValues'

const testFeeds = [
  'http://relay.fm/cortex/feed',
  'https://uwsto.instructure.com/feeds/courses/enrollment_rVOwu98ONqcA2ZGfOppvQvq0M6qyC5zoN0cz3Tx9.atom',
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCXuqSBlHAE6Xw-yeJA0Tunw'
]

export default function App (props: any): JSX.Element {
  const [feeds, setFeeds] = useState<Array<{
    url: string
    data: Output<Item>
  }>>([])
  const [feed, setFeed] = useState<Output<Item> | null>(null)
  const [activeItem, setActiveItem] = useState<Item | null>(null)

  const [addFeedDialogOpen, setAddFeedDialogOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleAddFeed = (_url: string, _data: Output<Item>): boolean => {
    const feedExists = feeds.findIndex((feed) => {
      if (feed.url === _url) {
        return true
      } else {
        return false
      }
    }) !== -1

    if (!feedExists) {
      setFeeds([{ url: _url, data: _data }, ...feeds])
      setAddFeedDialogOpen(false)
      return true
    } else {
      return false
    }
  }

  const handleFeedSelected = (feed: Output<Item>): void => {
    setFeed(feed)
  }

  const handleItemSelected = (item: Item): void => {
    setActiveItem(item)
    console.log(item)
  }

  const getItemContent = (): JSX.Element | HTMLDivElement => {
    if (activeItem !== null) {
      // add custom types to weird rss feed (such as youtube/relayfm)
      const displayItem = activeItem as (Item & {
        id: string
        'content:encoded': string
        enclosure: {
          type: string
          url: string
        }
        itunes: {
          image: string
        }
      })

      if (
        displayItem.link?.includes('youtube.com') ?? false
      ) {
        // YouTube Video
        const ytId = displayItem.id.split(':')[2]
        return (
          <>
            <Stack sx={{
              height: '100%',
              justifyContent: 'center'
            }}>
              <iframe
                style={{
                  width: '100%',
                  height: '80%',
                  border: 'none'
                }}
                src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen />
            </Stack>
          </>
        )
      } else if (
        displayItem.link?.includes('relay.fm') ?? false
      ) {
        // RelayFM Feed
        if (audioRef.current !== null) {
          audioRef.current?.pause()
          audioRef.current?.load()
        }
        return (
          <>
            <audio ref={audioRef} controls style={{
              width: '100%'
            }}>
              <source src={displayItem.enclosure?.url} type={displayItem.enclosure?.type} />
              Your browser does not support the audio element.
            </audio>
            <p dangerouslySetInnerHTML={{ __html: displayItem['content:encoded'] ?? '' }}></p>
          </>
        )
      } else {
        // Raw Content otherwise
        return (<div dangerouslySetInnerHTML={{ __html: (activeItem.content ?? activeItem.contentSnippet) ?? 'Could not find content.' }}></div>)
      }
    }
    if (feeds.length === 0) {
      return <p style={{ fontWeight: 'bold' }} >Add A Feed</p>
    } else if (feed === null) {
      return <p style={{ fontWeight: 'bold' }} >Select A Feed</p>
    } else {
      return <p style={{ fontWeight: 'bold' }} >Select A Feed Item</p>
    }
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography>Feeds Me</Typography>
          <Stack sx={{ flexGrow: 1 }} direction="row-reverse">
            {/* A button to quickly load feeds */}
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                ':hover': {
                  color: 'black',
                  bgcolor: 'white'
                }
              }}
              onClick={() => {
                const getTestData = async (): Promise<void> => {
                  const t = testFeeds.map(async (_url) => {
                    return {
                      url: _url,
                      data: await API.rssParseUrl(_url)
                    }
                  })
                  const newData = await Promise.all(t)
                  setFeeds([...newData, ...feeds])
                }
                void getTestData()
              }}
              disabled={ testFeeds.every((f) => feeds.map((feed) => feed.url).includes(f)) }
            >
              Load Test Feeds (Development Only)
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Stack sx={{ flexGrow: 1, overflow: 'hidden' }} direction="column">
        <Toolbar />
        <Stack sx={{ flexGrow: 1, overflow: 'hidden' }} direction="row">
          <Box
            sx={{
              borderRight: '1px solid gray',
              minWidth: '20%',
              overflow: 'auto'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Button
                onClick={() => { setAddFeedDialogOpen(true) }}
                variant="outlined"
                sx={{
                  flex: 1,
                  margin: 1
                }}
              >
                <Add />
                Add Feed
              </Button>
              <AddFeedDialog
                open={addFeedDialogOpen}
                onClose={ () => { setAddFeedDialogOpen(false) }}
                onAddFeed={handleAddFeed}
              />
            </Box>
            <FeedList
              feeds={feeds.map(f => f.data)}
              onFeedSelected={handleFeedSelected}
              feedSelected={feed}
            />
          </Box>
          <Box
            sx={{
              borderRight: '1px solid gray',
              minWidth: '25%',
              width: '25%',
              overflow: 'auto'
            }}
          >
            <Stack sx={{ bgcolor: 'lightgrey', alignItems: 'center' }} direction={'row'}>
              <Typography>Dummy Buttons:</Typography>
              <Button>Refresh</Button>
              <Button>Filter</Button>
              <Button>Feed Settings</Button>
            </Stack>
            <ItemList
              items={feed?.items ?? []}
              onItemSelected={handleItemSelected}
              itemSelected={activeItem}
            />
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <Stack sx={{ bgcolor: 'lightgrey', alignItems: 'center' }} direction={'row'}>
              <Typography>Dummy Buttons:</Typography>
              <Button>Mark As Read</Button>
              <Button>Save for Later</Button>
            </Stack>
            <Box sx={{ padding: 1, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <>
                {getItemContent()}
              </>
              <br />
              <RssItemKeyValues obj={activeItem}/>
            </Box>
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}
