type BookType = {
    type: 'book';
    isbn: string;
    title: string;
    numPages?: number;
}

interface BookInterface {
    isbn: string;
    title: string;
    numPages?: number; // optional
}

type EbookType = BookType & {
    type: 'ebook';
    fileSize: number; // in MB
    format: 'pdf' | 'epub' | 'mobi';
}

type AudiobookType = BookType & {
    type: 'audiobook';
    duration: number; // in minutes
    narrator: string;
}

interface EbookInterface extends BookInterface {
    fileSize: number; // in MB
    format: 'pdf' | 'epub' | 'mobi';
}

interface AudiobookInterface extends BookInterface {
    duration: number; // in minutes
    narrator: string;
}

type MediaItem = BookType | EbookType | AudiobookType;
type MediaItemInterface = BookInterface | EbookInterface | AudiobookInterface;

function describeItem(item: MediaItem): string {
    switch (item.type) {
        case 'book':
            return `Book: ${item.title} (ISBN: ${item.isbn})`;
        case 'ebook':
            return `Ebook: ${item.title} (ISBN: ${item.isbn}, File Size: ${item.fileSize}MB, Format: ${item.format})`;
        case 'audiobook':
            return `Audiobook: ${item.title} (ISBN: ${item.isbn}, Duration: ${item.duration} minutes, Narrator: ${item.narrator})`;
        default:
            return 'Unknown item type';
    }
}