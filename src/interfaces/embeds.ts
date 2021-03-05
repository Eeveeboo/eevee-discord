export interface Embed {
  title?: string; //title of embed
  type?: string; //type of embed (always "rich" for webhook embeds)
  description?: string; //description of embed
  url?: string; //url of embed
  timestamp?: string; //ISO8601 timestamp	timestamp of embed content
  color?: number; //color code of the embed
  footer?: {
    text: string; //footer text
    icon_url?: string; //url of footer icon (only supports http(s) and attachments)
    proxy_icon_url?: string; //a proxied url of footer icon
  }; //footer information
  image?: {
    url?: string; //source url of image (only supports http(s) and attachments)
    proxy_url?: string; //a proxied url of the image
    height?: number; //height of image
    width?: number; //width of image
  }; //embed image object	//image information
  thumbnail?: {
    url?: string; //source url of thumbnail (only supports http(s) and attachments)
    proxy_url?: string; //a proxied url of the thumbnail
    height?: number; //height of thumbnail
    width?: number; //width of thumbnail
  }; //embed thumbnail object	//thumbnail information
  video?: {
    url?: string; //source url of video
    proxy_url?: string; //a proxied url of the video
    height?: number; //height of video
    width?: number; //width of video
  }; //embed video object	//video information
  provider?: {
    name?: string; //name of provider
    url?: string; //url of provider
  }; //embed provider object	//provider information
  author?: {
    name?: string; //name of author
    url?: string; //url of author
    icon_url?: string; //url of author icon (only supports http(s) and attachments)
    proxy_icon_url?: string; //a proxied url of author icon
  }; //embed author object	//author information
  fields?: EmbedField[]; //array of embed field objects	//fields information
}
export interface EmbedField {
  name: string; //name of the field
  value: string; //value of the field
  inline?: boolean; //whether or not this field should display inline
}
