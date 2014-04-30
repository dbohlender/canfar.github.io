var canfar = {};

canfar.URI = function(uri)
{
  this.uri = uri;
  this.uriComponents = this.parse();
};

canfar.URI.prototype.getURI = function()
{
  return this.uri;
};

// This function creates a new anchor element and uses location
// properties (inherent) to get the desired URL data. Some String
// operations are used (to normalize results across browsers).
canfar.URI.prototype.parse = function()
{
  var a = document.createElement("a");
  a.href = this.getURI();

  return {
    source: this.getURI(),
    protocol:a.protocol && a.protocol.replace(':',''),
    host: a.hostname ? a.hostname : "",
    port: a.port ? a.port : "",
    query: a.search ? a.search : "",
    params: (function()
    {
      var ret = {},
          seg = (a.search ? a.search.replace(/^\?/,'').split('&') : ""),
          len = seg.length, i = 0, s;
      for (; i < len; i++)
      {
        if (!seg[i])
        {
          continue;
        }

        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: ((a.pathname && a.pathname.match(/\/([^\/?#]+)$/i)) || [,''])[1],
    hash: a.hash ? a.hash.replace('#','') : "",
    path: a.pathname ? a.pathname.replace(/^([^\/])/,'/$1') : "",
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
    segments: a.pathname ? a.pathname.replace(/^\//,'').split('/') : ""
  };
};

canfar.URI.prototype.getHash = function()
{
  return this.uriComponents.hash;
};

canfar.URI.prototype.getPath = function()
{
  return this.uriComponents.path;
};

canfar.URI.prototype.getFile = function()
{
  return this.uriComponents.file;
};

canfar.URI.prototype.getHost = function()
{
  return this.uriComponents.host;
};

canfar.URI.prototype.getQueryStringObject = function()
{
  var nvpair = {};
  var qs = this.uriComponents.query.replace('?', '');
  var pairs = qs.split('&');

  $.each(pairs, function(i, v)
  {
    var pair = v.split('=');
    nvpair[pair[0]] = pair[1];
  });

  return nvpair;
};