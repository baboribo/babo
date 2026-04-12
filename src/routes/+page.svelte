<script lang="ts">
  import { onMount } from 'svelte';

  let nowPlaying = $state<any>(null);

  async function getNowPlaying() {
    const res = await fetch('/api/now-playing');
    const data = await res.json();
    // console.log("받아온 노래 데이터:", data); // Spotify API에서 받아온 json을 콘솔에 뿌려줌.
    nowPlaying = data;
  }

  onMount(() => {
    getNowPlaying();
    const apiinterval = setInterval(() => {
        if (document.visibilityState === 'visible') {
            getNowPlaying();
        }
    }, 10000);

    const uiInterval = setInterval(() => {
        if (nowPlaying && nowPlaying.is_playing) {
            nowPlaying.progress_ms += 1000;

            if (nowPlaying.progress_ms > nowPlaying.item.duration_ms) {
                nowPlaying.progress_ms = nowPlaying.item.duration_ms;
            }
        }
    }, 1000);
    return () => {
        clearInterval(apiinterval);
        clearInterval(uiInterval);
    };
  });
</script>

<div class="main-container">
    <img class="avatar" src="https://avatars.githubusercontent.com/u/71020988?v=4" alt="?" />
    <h2>바보리보</h2>
    <p>여러가지 시도를 좋아해요.</p>
</div>

<h2>현재 듣는 곡</h2>
{#if nowPlaying}
  {#if nowPlaying.is_playing}
    <div>
      <img 
        src={nowPlaying.item.album.images[0].url} 
        alt="Album Art" 
        width="80" 
        style="border-radius: 4px;"
      />
      <div>
        <strong>{nowPlaying.item.name}</strong>
        
        <p>
          {nowPlaying.item.artists.map((a) => a.name).join(', ')}
        </p>
        <div class="progress-bg">
        <div 
            class="progress-bar" 
            style="width: {(nowPlaying.progress_ms / nowPlaying.item.duration_ms) * 100}%"
        ></div>
        </div>
        
        <span>
            {Math.floor(nowPlaying.progress_ms / 1000 / 60)}:{String(Math.floor((nowPlaying.progress_ms / 1000) % 60)).padStart(2, '0')} 
            / 
            {Math.floor(nowPlaying.item.duration_ms / 1000 / 60)}:{String(Math.floor((nowPlaying.item.duration_ms / 1000) % 60)).padStart(2, '0')}
        </span>

        <span>Spotify에서 듣는 중</span>
        <p>{nowPlaying.item.album.external_urls}</p>
      </div>
    </div>
  {:else}
    <p>지금은 노래를 듣고 있지 않아요.</p>
  {/if}
{:else}
  <p>데이터 불러오는 중...</p>
{/if}

<style>
  .progress-bg { width: 100%; height: 6px; background: #333; border-radius: 3px; margin: 10px 0; }
  .progress-bar { 
    height: 100%; background: #1DB954; border-radius: 3px; 
    transition: width 0.2s linear;
  }
</style>