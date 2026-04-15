// components/ui/AdSlot.tsx
// 广告位组件 — 接 Google Adsense 时替换内部内容即可
// size: banner=横幅(728x90), square=方块(300x250), mobile=移动(320x50)

interface Props {
  id: string
  size: 'banner' | 'square' | 'mobile'
  label?: string
}

const SIZE_STYLES: Record<string, { minHeight: string; maxWidth: string }> = {
  banner: { minHeight: '90px',  maxWidth: '728px' },
  square: { minHeight: '250px', maxWidth: '300px' },
  mobile: { minHeight: '50px',  maxWidth: '320px' },
}

export default function AdSlot({ id, size, label = '广告' }: Props) {
  const style = SIZE_STYLES[size]

  // 生产环境：把下面 div 内容换成 Google Adsense 代码
  // <ins class="adsbygoogle" data-ad-client="ca-pub-XXXXXXX" data-ad-slot="XXXXXXX" .../>

  return (
    <div
      id={`ad-${id}`}
      style={{
        width: '100%',
        maxWidth: style.maxWidth,
        minHeight: style.minHeight,
        margin: '0 auto',
        background: '#f8f7f4',
        border: '0.5px dashed #ccc',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#bbb',
        fontSize: '12px',
        letterSpacing: '0.05em',
      }}
    >
      {label} · {style.maxWidth} × {style.minHeight}
    </div>
  )
}
