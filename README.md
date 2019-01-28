# aem-i18n-convert

**Description**

Use aem-i18n-convert to convert JSON format dictionaries to sling:MessageEntry format.  This is highly beneficial in
large production environments with continuously changing keys.  

If you're using a sling:MessageEntry format, you can create content packages with specific keys that may need to be 
rolled into a release, without releasing the whole dictionary (and merging it with production values ahead of time).  

If you're using JSON format dictionaries, you will need to either manually add new keys / update existing keys, or merge 
all of the production values ahead of time (which still leaves a window of time where keys may be updated in production
just before you release your updated dictionary).

Keys are automatically sorted alphabetically to make hand merging easier if necessary.

**Usage**

    Convert an AEM i18n dictionary to sling:MessageEntries.
    Usage: aem-i18n-convert.js
    
    Options:
      --version    Show version number                                     [boolean]
      -H, --help   Print usage and quit.                                   [boolean]
      -i, --input  i18n json format file

**Example**

    # npm install -g aem-i18n-convert
    # aem-i18n-convert --input /path/to/en_us.json > /path/to/apps/project/i18n/mydictionary/en_us.xml