#/bin/bash
i=0
j=9
while true
do
xrandr --output LVDS-1 --brightness $i.$j
j=$(($j-1))
if [[ $j -eq 0 ]]
then
j=9
i=$(($i-1))
fi
done
