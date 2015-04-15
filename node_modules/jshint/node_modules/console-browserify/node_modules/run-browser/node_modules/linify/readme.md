# Linify

Transform a file's line endings from `\r\n` to `\n`.

## Installation

    npm install linify

## API

### linify(path, options)

Recursively transforms a directory or file and returns an array of the paths of all the files that were transformed.

 - path: string path to either a file or a directory
 - options: object hash of:
   - filter: any kind of filter on the paths that should be transformed
   - preview: if true then the transformed files are not actually written

## License

  MIT