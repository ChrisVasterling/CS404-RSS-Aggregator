import { Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import React from 'react'
import { type Output, type Item } from 'rss-parser'

export default function FeedList (props: {
  feeds: Array<Output<Item>>
  onFeedSelected: (feed: Output<Item>) => void
  feedSelected: Output<Item> | null

}): JSX.Element {
  const { feeds, onFeedSelected, feedSelected } = props
  return (
    <>
      {feeds.length > 0 && (
        <Divider sx={{ my: 1 }} />
      )}
      <List disablePadding>
        {feeds.map((feed, index) => {
          return (
            <ListItem key={index} disableGutters disablePadding
              sx={{
                bgcolor: (feedSelected != null) && feedSelected.title === feed.title ? 'gray' : 'unset'
              }}
            >
              <ListItemButton onClick={() => { onFeedSelected(feed) }}>
                <ListItemText>{feed.title}</ListItemText>
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
