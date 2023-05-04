import React from 'react'
import { Divider } from '@mui/material'
import { type Item } from 'rss-parser'

export default function RssItemKeyValues (props: { obj: Item | any | null, truncateLength?: number }): JSX.Element {
  const { obj, truncateLength } = props
  if (obj !== null) {
    return (
      <div style={{ wordWrap: 'break-word' }}>
        {Object.keys(obj ?? {}).map((key, index) => {
          return (
            <div key={index}>
              <Divider sx={{ my: 1 }} />
              <div style={{ paddingLeft: '1.5em' }} >
                <span style={{ fontWeight: 'bold' }}>{key}: </span>
                {typeof obj[key] === 'object'
                  ? (
                      <RssItemKeyValues obj={obj[key]} />
                    )
                  : (
                  <span>
                    {obj[key].indexOf('http') === 0
                      ? (
                      <a href={obj[key]} target="_blank" rel="noreferrer">{obj[key]}</a>
                        )
                      : (
                      <span>
                        {(truncateLength !== undefined && obj[key].length >= truncateLength)
                          ? (
                              Array.from(obj[key]).slice(0, truncateLength).concat('...').join('')
                            )
                          : (
                              obj[key]
                            )
                        }
                      </span>
                        )}
                  </span>
                    )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  return <></>
}
