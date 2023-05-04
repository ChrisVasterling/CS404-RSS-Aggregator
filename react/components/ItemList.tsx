import { List, ListItem, ListItemButton, ListItemText } from "@mui/material"
import React from "react"
import { Output, Item } from "rss-parser"



export default function ItemList(props: {
  items: Item[],
  onItemSelected: (item: Item) => void,
  itemSelected: Item | null
}) {
  const { items, onItemSelected, itemSelected } = props

  return (
    <List disablePadding>
      {items.map((item, index) => {
        return (
          <ListItem key={index} disableGutters disablePadding
            sx={{
              bgcolor: itemSelected && itemSelected.title === item.title ? "gray" : "unset"
            }}
          >
            <ListItemButton onClick={() => { onItemSelected(item) }}>
              <ListItemText>{item.title}</ListItemText>
            </ListItemButton>
          </ListItem>
        )
      })}
    </List>
  )
}
