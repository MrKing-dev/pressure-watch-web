'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "dd35a5e08130b07af36aa173d338fa10",
"assets/assets/weathericons/clear-day.png": "2143218986fb2a2d3b2587f5dbe16a1a",
"assets/assets/weathericons/clear-night.png": "c1b72a2ef626a8632fcba433dc289a5b",
"assets/assets/weathericons/cloudy.png": "cf04fae56d96223ceda5c855ad522c1d",
"assets/assets/weathericons/fog.png": "e20623f92ea09fee393403d432b1d52d",
"assets/assets/weathericons/hail.png": "3b49c446053e59a2826afca4410d7dae",
"assets/assets/weathericons/partly-cloudy-day.png": "f490387abad6a9957da5da4afe35cd19",
"assets/assets/weathericons/partly-cloudy-night.png": "1b6a4be6d9b67f3e8a50330e7b0d3587",
"assets/assets/weathericons/rain-snow-showers-day.png": "f45f24959875d194dea67e370656dfa9",
"assets/assets/weathericons/rain-snow-showers-night.png": "4ede99e3c2bd5a470b94b8f7d01d841e",
"assets/assets/weathericons/rain-snow.png": "6792a2da9151d8806b222ad34a66bdc6",
"assets/assets/weathericons/rain.png": "0d05aa7a23d346754a51518b3c8df9b2",
"assets/assets/weathericons/README": "f65b586efb2392e57c1ec089d80fdd71",
"assets/assets/weathericons/showers-day.png": "c393e8afc1d7bfe4479decccf3c038b1",
"assets/assets/weathericons/showers-night.png": "e407f05a9b3d68534e1881b59bcecdb5",
"assets/assets/weathericons/sleet.png": "96f15a89dcf07c0fb80168cd122d5b07",
"assets/assets/weathericons/snow-showers-day.png": "69cad0546e4a47bc4fb2f73b7000856e",
"assets/assets/weathericons/snow-showers-night.png": "f8ef5a2611886cefafdd629b9ded4e60",
"assets/assets/weathericons/snow.png": "ca5f9698349cf0c0108c7b39a4e0d9f5",
"assets/assets/weathericons/thunder-rain.png": "4cbec3c3f2043b4fbd00811026849e3e",
"assets/assets/weathericons/thunder-showers-day.png": "c0870d62b3b3cb5a9eb0ced341ef2eda",
"assets/assets/weathericons/thunder-showers-night.png": "23c0466abbd0cb70abb4d650f8795447",
"assets/assets/weathericons/thunder.png": "7cb9515adbefdf51d392a6c4ce249078",
"assets/assets/weathericons/wind.png": "30fa5065810bbfd9f72ff277cd9e57b1",
"assets/FontManifest.json": "45a4b1254a2b10f588254168d4006a98",
"assets/fonts/MaterialIcons-Regular.otf": "e7069dfd19b331be16bed984668fe080",
"assets/NOTICES": "7ba3630a889313915179736de513ed92",
"assets/packages/weather_icons/lib/fonts/weathericons-regular-webfont.ttf": "4618f0de2a818e7ad3fe880e0b74d04a",
"canvaskit/canvaskit.js": "97937cb4c2c2073c968525a3e08c86a3",
"canvaskit/canvaskit.wasm": "3de12d898ec208a5f31362cc00f09b9e",
"canvaskit/profiling/canvaskit.js": "c21852696bc1cc82e8894d851c01921a",
"canvaskit/profiling/canvaskit.wasm": "371bc4e204443b0d5e774d64a046eb99",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "1cfe996e845b3a8a33f57607e8b09ee4",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "ae05028cb87fe882cbf6eb098e41486f",
"/": "ae05028cb87fe882cbf6eb098e41486f",
"main.dart.js": "45b992358a3e888f18412b388e1106c2",
"manifest.json": "b155bf5d64089054b53f9a84250afba7",
"version.json": "75623a369382bba8701f2756393e3aab"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
