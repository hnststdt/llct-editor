interface MusicGroupMetadata {
  id: string
  name: string
  artists: string[]
  color: string
}

interface LLCTSongDataV2 {
  groups?: MusicGroupMetadata[]
  songs?: MusicMetadata[][]
}

interface SongStreamingProvider {
  spotify?: string
  youtube?: string
}

interface MusicExtraMetadata {
  released?: number
  streaming?: SongStreamingProvider
}
interface MusicMetadata {
  title: string
  'title.ko'?: string
  artist: string | number | number[] | ArtistGroup
  image: string
  metadata?: MusicExtraMetadata
}

interface MusicMetadataWithID extends MusicMetadata {
  id: string
}
