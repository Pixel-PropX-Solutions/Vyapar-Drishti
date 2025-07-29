import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, View, ViewStyle } from 'react-native';

const { width, height } = Dimensions.get('window');

type Vector = {x: number, y: number}

type Circle = {
  pos: Vector,
  vel: Vector,
  size: number
};

const createCircle = (x: number, y: number, size: number): Circle => ({
  pos: {x, y},
  vel: {x: Math.random() * 2 - 1, y: Math.random() * 2 - 1},
  size: size
});

const softColors = [
  'rgba(255, 182, 193, 0.6)',  // Light Pink
  'rgba(135, 206, 250, 0.6)',  // Light Sky Blue
  'rgba(144, 238, 144, 0.6)',  // Light Green
  'rgba(221, 160, 221, 0.6)',  // Plum
  'rgba(173, 216, 230, 0.6)',  // Light Blue
  'rgba(255, 228, 225, 0.6)',  // Misty Rose
  'rgba(240, 230, 140, 0.6)',  // Khaki
  'rgba(250, 250, 210, 0.6)',  // Light Goldenrod Yellow
  'rgba(176, 224, 230, 0.6)',  // Powder Blue
  'rgba(255, 255, 224, 0.6)',  // Light Yellow
];


export default function ParticleBackground({style, childs, maxSize=150}: {style?: ViewStyle, childs?: ReactNode[], maxSize?: number}) {

  const circleSize = useRef(Array.from({length: childs?.length ?? 10}, _ => Math.floor(Math.random() * 50 + maxSize - 50))).current;


  const [circles, setCircles] = useState(circleSize.map(size => (
    createCircle(
      Math.floor(Math.random() * width - size), 
      Math.floor(Math.random() * height - size), 
      Math.random() * 50 + 100
    )
  )))


  function updateCircles() {
    setCircles(circles.map((circle, index) => {
      circle.pos.x += circle.vel.x;
      circle.pos.y += circle.vel.y;

      if(circle.pos.x < 0 || width - circleSize[index] < circle.pos.x) {
        circle.vel.x *= -1;
        circle.pos.x = circle.pos.x < 0 ? 0 : width - circleSize[index]
      } else  if(circle.pos.y < 0 || height - circleSize[index] < circle.pos.y) {
        circle.vel.y *= -1;
        circle.pos.y = circle.pos.y < 0 ? 0 : height - circleSize[index]
      }

      return {...circle}
    }))
  }


  function animate() {
    updateCircles();
    setTimeout(() => {
      requestAnimationFrame(animate)
    }, 10)
  }


  useEffect(() => {
    requestAnimationFrame(animate)
  }, []);

  return (
    <View
      style={{...style, position: 'absolute', minWidth: width, minHeight: height}}
    >
      {circles.map((circle, index) => (
        <View
          key={index}
          style={{
            position: 'absolute',
            width: circleSize[index],
            aspectRatio: 1,
            borderRadius: circleSize[index],
            backgroundColor: softColors[index],
            top: circle.pos.y, left: circle.pos.x,
            alignItems: 'center',
            justifyContent: 'center'
          }}
          children={childs?.at(index) ?? null}
        />
      ))}
    </View>
  );
}