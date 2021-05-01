interface SongsListComponentProps {
  items: MusicMetadataWithID[]
  onClick: (id: MusicMetadataWithID) => void
}

const SongsListComponent = ({ items, onClick }: SongsListComponentProps) => {
  return (
    <div className='song-lists'>
      {items.map((v, i) => {
        return (
          <p key={i} onClick={() => onClick(v)}>
            {v.id}: {v.title + `${v['title.ko'] ? ` (${v['title.ko']})` : ''}`}
          </p>
        )
      })}
    </div>
  )
}

export default SongsListComponent
