import collections
import datetime
import math
import time
from functools import partial
from kivy.uix.screenmanager import Screen
from kivy.app import App
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.label import Label
from kivy.clock import Clock
from kivy.lang import Builder
from kivy.graphics import Color, Line, RoundedRectangle

from time import asctime


Builder.load_string('''
<ClockScreen>:

    on_pos: self.update_clock()
    on_size: self.update_clock()

    canvas.before:
        Color:
            rgb: 0.820, 0.925, 1  # Set the background color to white
        Rectangle:
            pos: self.pos
            size: self.size

    FloatLayout
        id: face
        size_hint: None, None
        pos_hint: {"center_x":0.275, "center_y":0.54}
        size: 0.85*min(root.size), 0.85*min(root.size)
        canvas:
            Color:
                rgb: 1, 1, 1
            Ellipse:
                size: self.size
                pos: self.pos

            # Add outline
            Color:
                rgb: 0, 0, 0
            Line:
                ellipse: self.pos[0] + 1, self.pos[1] + 1, self.size[0] - 2, self.size[1] - 2
                width: 1.5
                cap: 'round'

    FloatLayout
        id: notepad
        size_hint: None, None
        pos_hint: {"center_x": 0.75, "center_y": 0.7}  # Adjusted the position to the left side
        size: 0.7*min(root.size), 0.5*min(root.size)
        canvas:
            Color:
                rgb: 1, 1, 0.75  # Light yellow color
            RoundedRectangle:
                size: self.size
                pos: self.pos
                radius: [10, 10, 10, 10]  # Adjust the radius as needed

        Label:
            text: "Today's Date:"
            pos_hint: {"center_x": 0.5, "center_y": 0.8}
            color: 0, 0, 0, 1
            font_size: 70

        Label:
            text: root.formatted_date
            pos_hint: {"center_x": 0.5, "center_y": 0.5}  # Adjust the position as needed
            color: 0, 0, 0, 1
            font_size: 50


    FloatLayout
        id: hands
        size_hint: None, None
        pos_hint: {"center_x":0.3, "center_y":0.54}
        size: 0.7*min(root.size), 0.7*min(root.size)
''')


Position = collections.namedtuple('Position', 'x y')


class ClockScreen(Screen):
    formatted_date = time.strftime("%A %B %d %Y")

    digital_clock_date = Label(
        text=asctime(),
        pos_hint={
            "center_x": 6,
            "center_y": 0.7,
        },
        font_size=30,
        color=(0, 0, 0, 1),
    )

    digital_clock_time = Label(
        text=asctime(),
        pos_hint={
            "center_x": 1.5,
            "center_y": 0.1,
        },
        font_size=100,
        color=(0, 0, 0, 1),
        font_name="DejaVuSans"
    )

    def on_parent(self, myclock, parent):
        """
        Add number labels when added in widget hierarchy
        """
        for i in range(1, 13):
            number = Label(
                text=str(i),
                pos_hint={
                    # pos_hint is a fraction in range (0, 1)
                    "center_x": 0.5 + 0.45 * math.sin(2 * math.pi * i / 12),
                    "center_y": 0.5 + 0.45 * math.cos(2 * math.pi * i / 12),
                },
                color=(0, 0, 0),
                font_size=40
            )
            self.ids["face"].add_widget(number)
        self.ids["face"].add_widget(self.digital_clock_date)
        self.ids["face"].add_widget(self.digital_clock_time)

        # Schedule the clock update
        Clock.schedule_interval(self.update_clock, 1)

    def position_on_clock(self, fraction, length, center_x, center_y):
        """
        Calculate position in the clock using trigonometric functions
        """
        return Position(
            center_x + length * math.sin(2 * math.pi * fraction),
            center_y + length * math.cos(2 * math.pi * fraction),
        )

    def update_clock(self, *args):
        """
        Redraw clock hands and update digital clock text
        """
        time_now = datetime.datetime.now()
        hands = self.ids["hands"]

        center_x = hands.center_x
        center_y = hands.center_y

        seconds_hand = self.position_on_clock(time_now.second / 60, length=0.45 * hands.size[0], center_x=center_x,
                                              center_y=center_y)
        minutes_hand = self.position_on_clock(time_now.minute / 60 + time_now.second / 3600,
                                              length=0.40 * hands.size[0], center_x=center_x, center_y=center_y)
        hours_hand = self.position_on_clock(time_now.hour / 12 + time_now.minute / 720,
                                            length=0.35 * hands.size[0], center_x=center_x, center_y=center_y)

        hands.canvas.clear()
        with hands.canvas:
            Color(0, 0, 0)
            Line(points=[center_x, center_y, seconds_hand.x, seconds_hand.y], width=1, cap="round")
            Color(0, 0, 0)
            Line(points=[center_x, center_y, minutes_hand.x, minutes_hand.y], width=2, cap="round")
            Color(0, 0, 0)
            Line(points=[center_x, center_y, hours_hand.x, hours_hand.y], width=3, cap="round")

        formatted_time = time_now.strftime("%I:%M %p")
        formatted_date = time_now.strftime("%A %B %d %Y")
        self.digital_clock_date.text = formatted_date
        self.formatted_date = formatted_date  # Update the formatted_date attribute
        self.digital_clock_time.text = formatted_time



if __name__ == '__main__':
    from kivy.uix.screenmanager import ScreenManager

    screen_manager = ScreenManager()
    screen_manager.add_widget(ClockScreen(name='clock'))

    from kivy.base import runTouchApp
    runTouchApp(screen_manager)