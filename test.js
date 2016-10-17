import test from 'ava';
import fn from './';

/**
 *  Vimeo should be able to find these patterns:
 *
 *  // urls
 * 	https://vimeo.com/*
 *  https://player.vimeo.com/video/*
 *  https://vimeo.com/*?
 *
 *  // iframe
 *  <iframe src="https://player.vimeo.com/video/97682350"
 *
 */

test('gets vimeo id', t => {
	t.is(fn('https://player.vimeo.com/video/123450987'), '123450987');
	t.is(fn('https://vimeo.com/1230897'), '1230897');
	t.is(fn('https://vimeo.com/140542479#t=0m3s'), '140542479');
});

test('gets vimeo id from iframe', t => {
	const str = '<iframe src="https://player.vimeo.com/video/97682350" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> <p><a href="https://vimeo.com/97682350">Todo list application utilizing the Swift programming language</a> from <a href="https://vimeo.com/user27750098">Rex Fatahi</a> on <a href="https://vimeo.com">Vimeo</a>.</p>';
	t.is(fn(str), '97682350');
});

/**
 *  Vine should be able to find these patterns:
 *
 *  // urls
 *  https://vine.co/v/*
 *
 *  // iframe
 *  <iframe src="https://vine.co/v/bjpPT1xwg6B/embed/simple"
 *  <iframe src="https://vine.co/v/bjpPT1xwg6B/embed/postcard"
 *
 */

test('gets vine id', t => {
	t.is(fn('https://vine.co/v/e5vIvmV5v9J'), 'e5vIvmV5v9J');
	t.is(fn('https://vine.co/v/e5vIvmV5v9J/'), 'e5vIvmV5v9J');
	t.is(fn('https://vine.co/v/e5vIvmV5v9J/embed'), 'e5vIvmV5v9J');
	t.is(fn('https://vine.co/v/e5vIvmV5v9J/card?api=1/'), 'e5vIvmV5v9J');
	t.is(fn('https://vine.co/v/bjpPT1xwg6B/embed/simple'), 'bjpPT1xwg6B');
	t.is(fn('https://vine.co/v/bjpPT1xwg6B/embed/postcard?audio=1'), 'bjpPT1xwg6B');
});

test('gets vine id from simple vine iframe embeds', t => {
	const str = '<iframe src="https://vine.co/v/bjpPT1xwg6B/embed/simple" width="600" height="600" frameborder="0"></iframe>';
	t.is(fn(str), 'bjpPT1xwg6B');
});

test('gets vine id from postcard vine iframe embeds', t => {
	const str = '<iframe src="https://vine.co/v/bjpPT1xwg6B/embed/postcard" width="600" height="600" frameborder="0"></iframe>';
	t.is(fn(str), 'bjpPT1xwg6B');
});

/**
 * Youtube should be able to find these patterns:
 *
 *  // shortcodes
 *  http://youtu.be/*?
 *  https://youtu.be/*
 *  http://youtu.be/*
 *  youtube://
 *
 *  // /v/ or /vi/
 *  http://www.youtube.com/v/*
 *  http://youtube.com/vi/*?
 *  http://youtube.com/v/*?
 *
 *  // v= or vi=
 *  http://www.youtube.com/ytscreeningroom?v=*
 *  http://www.youtube.com/watch?v=*?&
 *  https://www.youtube.com/watch?v=*
 *  http://youtube.com/watch?vi=*&
 *  http://youtube.com/?vi=*&
 *  http://youtube.com/?v=*
 *
 *  // embed
 *  http://www.youtube.com/embed/*?
 *  www.youtube-nocookie.com/embed/*?
 *  https://www.youtube.com/embed/*
 *
 *  // user
 *  http://www.youtube.com/user/username#p/a/u/2/*
 *  http://www.youtube.com/user/username#p/u/1/*?
 *  http://www.youtube.com/user/username#p/u/1/*
 *
 *  // iframe embed
 *  <iframe width="560" height="315" src="https://www.youtube.com/embed/*" frameborder="0" allowfullscreen></iframe>
 *
 *  // attribution_link
 *  http://www.youtube.com/attribution_link?u=%2Fwatch%3Fv%3D*%26
 *  https://www.youtube.com/attribution_link?u=%2Fwatch%3Fv%3D*%26
 *
 */

test('gets youtube id from iframe', t => {
	const str = '<iframe width="560" height="315" src="https://www.youtube.com/embed/97682350" frameborder="0" allowfullscreen></iframe>';
	t.is(fn(str), '97682350');
});

test('gets youtube shortcode formats', t => {
	t.is(fn('youtube://ABC12301'), 'ABC12301');
	t.is(fn('https://youtu.be/ABC12302'), 'ABC12302');
	t.is(fn('http://youtu.be/ABC12303'), 'ABC12303');
	t.is(fn('http://youtu.be/ABC12304?feature=youtube_gdata_player'), 'ABC12304');
});

test('handles youtube v= and vi= formats', t => {
	t.is(fn('http://www.youtube.com/ytscreeningroom?v=ABC1230'), 'ABC1230');
	t.is(fn('https://www.youtube.com/watch?v=ABC12301'), 'ABC12301');
	t.is(fn('http://www.youtube.com/watch?v=ABC12302&list=abc123&index=2&feature=plpp_video'), 'ABC12302');
	t.is(fn('http://www.youtube.com/watch?v=ABC12303&feature=channel'), 'ABC12303');
	t.is(fn('http://www.youtube.com/watch?v=ABC12304&playnext_from=TL&videos=abc123&feature=sub'), 'ABC12304');
	t.is(fn('http://www.youtube.com/watch?v=ABC12305&feature=channel'), 'ABC12305');
	t.is(fn('http://www.youtube.com/watch?v=ABC12306&playnext_from=TL&videos=abc123&feature=sub'), 'ABC12306');
	t.is(fn('http://www.youtube.com/watch?v=ABC12307'), 'ABC12307');
	t.is(fn('http://youtube.com/?v=ABC12308&feature=youtube_gdata_player'), 'ABC12308');
	t.is(fn('http://youtube.com/?vi=ABC12309&feature=youtube_gdata_player'), 'ABC12309');
	t.is(fn('http://youtube.com/watch?v=ABC12310&feature=youtube_gdata_player'), 'ABC12310');
	t.is(fn('http://youtube.com/watch?vi=ABC12311&feature=youtube_gdata_player'), 'ABC12311');
	t.is(fn('http://www.youtube.com/watch?v=ABC12312&feature=youtube_gdata_player'), 'ABC12312');
	t.is(fn('http://www.youtube.com/watch?v=ABC12313&feature=youtu.be'), 'ABC12313');
});

test('handles youtube /v/ and /vi/ formats', t => {
	t.is(fn('http://www.youtube.com/v/ABC1230'), 'ABC1230');
	t.is(fn('http://youtube.com/v/ABC12301?feature=youtube_gdata_player'), 'ABC12301');
	t.is(fn('http://youtube.com/vi/ABC12302?feature=youtube_gdata_player'), 'ABC12302');
});

test('handles youtube /embed/ formats', t => {
	t.is(fn('https://www.youtube.com/embed/ABC1230'), 'ABC1230');
	t.is(fn('www.youtube-nocookie.com/embed/ABC12301?rel=0'), 'ABC12301');
	t.is(fn('http://www.youtube.com/embed/ABC12302?rel=0'), 'ABC12302');
});

test('handles youtube /user/ formats', t => {
	t.is(fn('http://www.youtube.com/user/username#p/u/1/ABC1230'), 'ABC1230');
	t.is(fn('http://www.youtube.com/user/username#p/a/u/2/ABC12301'), 'ABC12301');
	t.is(fn('http://www.youtube.com/user/username#p/u/1/ABC12302?rel=0'), 'ABC12302');
});

test('removes -nocookie', t => {
	t.is(fn('http://www.youtube-nocookie.com/ytscreeningroom?v=ABC12300'), 'ABC12300');
	t.is(fn('http://www.youtube-nocookie.com/v/ABC12301'), 'ABC12301');
	t.is(fn('http://www.youtube-nocookie.com/user/username#p/u/1/ABC12302'), 'ABC12302');
	t.is(fn('https://www.youtube-nocookie.com/embed/ABC12303'), 'ABC12303');
});

test('handles youtube attribution_links', t => {
	t.is(fn('http://www.youtube.com/attribution_link?u=%2Fwatch%3Fv%3DABC12300%26feature%3Dshare&a=JdfC0C9V6ZI'), 'ABC12300');
	t.is(fn('https://www.youtube.com/attribution_link?a=JdfC0C9V6ZI&u=%2Fwatch%3Fv%3DABC12301%26feature%3Dshare'), 'ABC12301');
});

test('expects a string', t => {
	t.throws(() => {
		fn({});
	}, 'get-video-id expects a string');
});
