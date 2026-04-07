/**
 * File: ASLoaderCollection.js
 * Purpose: simple continuous looping animation for bars
 */
document.addEventListener("DOMContentLoaded", () => {
    const bars = document.querySelectorAll(".ASBarFill");
  
    bars.forEach(bar => {
      let progress = 0;
      setInterval(() => {
        progress = (progress + 3) % 100;
        bar.style.width = progress + "%";
      }, 80);
    });

      // Animate progress loaders
    document.querySelectorAll(".ASProgressGroup").forEach(group => {
        const bar = group.querySelector(".ASProgressBar");
        const value = group.querySelector(".ASProgressValue");
        const percent = parseInt(group.dataset.progress, 10);
        let current = 0;

        const interval = setInterval(() => {
        if (current <= percent) {
            bar.style.width = current + "%";
            value.textContent = current + "%";
            current++;
        } else {
            clearInterval(interval);
        }
        }, 25);
    });


    document.addEventListener("DOMContentLoaded", () => {
        const skeletonBlocks = document.querySelectorAll(".ASSkeletonCard, .ASSkeletonList, .ASSkeletonTable");
        
        skeletonBlocks.forEach(block => {
        block.classList.add("is-loading");
        setTimeout(() => {
            block.classList.remove("is-loading");
        }, 4000); 
        });
    });
  });
  